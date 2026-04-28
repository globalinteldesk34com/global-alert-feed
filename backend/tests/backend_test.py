"""Backend API tests for Global Intel Desk."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://threat-alert-pro.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

TEST_EMAIL = "test@gid.com"
TEST_PASSWORD = "test123"


# ---------- Fixtures ----------
@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def auth_token(client):
    # try login first
    r = client.post(f"{API}/auth/login", json={"email": TEST_EMAIL, "password": TEST_PASSWORD})
    if r.status_code == 200:
        return r.json()["token"]
    # fallback: register if not seeded
    r = client.post(f"{API}/auth/register", json={
        "email": TEST_EMAIL, "password": TEST_PASSWORD,
        "full_name": "Test Operator", "organization": "Test Org"
    })
    assert r.status_code == 200, f"Could not register or login: {r.text}"
    return r.json()["token"]


@pytest.fixture
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"}


# ---------- Health ----------
class TestHealth:
    def test_root_operational(self, client):
        r = client.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "operational"
        assert "Global Intel Desk" in data.get("service", "")


# ---------- Auth ----------
class TestAuth:
    def test_register_new_operator(self, client):
        email = f"TEST_user_{uuid.uuid4().hex[:8]}@gid.com"
        r = client.post(f"{API}/auth/register", json={
            "email": email, "password": "secret123",
            "full_name": "Reg User", "organization": "QA"
        })
        assert r.status_code == 200, r.text
        data = r.json()
        assert "token" in data and len(data["token"]) > 10
        assert data["user"]["email"] == email.lower()
        assert data["user"]["full_name"] == "Reg User"
        assert "id" in data["user"]

    def test_register_duplicate_rejected(self, client, auth_token):
        r = client.post(f"{API}/auth/register", json={
            "email": TEST_EMAIL, "password": "x123456",
            "full_name": "Dup", "organization": "X"
        })
        assert r.status_code == 400

    def test_login_success(self, client, auth_token):
        r = client.post(f"{API}/auth/login", json={"email": TEST_EMAIL, "password": TEST_PASSWORD})
        assert r.status_code == 200
        assert "token" in r.json()
        assert r.json()["user"]["email"] == TEST_EMAIL

    def test_login_invalid_credentials(self, client):
        r = client.post(f"{API}/auth/login", json={"email": TEST_EMAIL, "password": "WRONG"})
        assert r.status_code == 401

    def test_me_with_token(self, client, auth_headers):
        r = client.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["email"] == TEST_EMAIL

    def test_me_without_token(self, client):
        # Use a fresh client without auth header
        r = requests.get(f"{API}/auth/me")
        assert r.status_code in (401, 403)


# ---------- Contact ----------
class TestContact:
    def test_contact_submit(self, client):
        r = client.post(f"{API}/contact", json={
            "name": "TEST Jane", "email": "TEST_jane@ex.com",
            "company": "QA Co", "phone": "+10000000",
            "message": "Test inquiry from automation."
        })
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("status") == "received"
        assert "id" in data
        # email mocked when key empty
        assert data.get("email_dispatched") is False


# ---------- Itineraries auth guard ----------
class TestAuthGuard:
    def test_list_itineraries_unauth(self):
        r = requests.get(f"{API}/itineraries")
        assert r.status_code in (401, 403)

    def test_create_itinerary_unauth(self):
        r = requests.post(f"{API}/itineraries", json={
            "traveler_name": "x", "destination_country": "y", "destination_city": "z",
            "purpose": "business", "start_date": "2026-02-01", "end_date": "2026-02-05"
        })
        assert r.status_code in (401, 403)

    def test_dashboard_stats_unauth(self):
        r = requests.get(f"{API}/dashboard/stats")
        assert r.status_code in (401, 403)


# ---------- Itinerary CRUD + AI ----------
@pytest.fixture(scope="class")
def itinerary_id(request, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"}
    r = requests.post(f"{API}/itineraries", headers=headers, json={
        "traveler_name": "TEST Traveler",
        "destination_country": "France",
        "destination_city": "Paris",
        "purpose": "business",
        "start_date": "2026-02-10",
        "end_date": "2026-02-15",
        "notes": "Pytest itinerary"
    })
    assert r.status_code == 200, r.text
    iid = r.json()["id"]
    yield iid
    # cleanup
    try:
        requests.delete(f"{API}/itineraries/{iid}", headers=headers)
    except Exception:
        pass


class TestItineraryCRUD:
    def test_create_itinerary_persisted(self, client, auth_headers, itinerary_id):
        r = client.get(f"{API}/itineraries/{itinerary_id}", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert data["destination_city"] == "Paris"
        assert data["traveler_name"] == "TEST Traveler"
        assert data["status"] in ("planned", "active", "completed")
        assert data["assessment"] is None
        assert data["alerts"] == []

    def test_list_includes_created(self, client, auth_headers, itinerary_id):
        r = client.get(f"{API}/itineraries", headers=auth_headers)
        assert r.status_code == 200
        ids = [it["id"] for it in r.json()]
        assert itinerary_id in ids

    def test_assess_itinerary_with_ai(self, client, auth_headers, itinerary_id):
        # AI call: 15-30s expected
        r = client.post(f"{API}/itineraries/{itinerary_id}/assess",
                        headers=auth_headers, timeout=90)
        assert r.status_code == 200, r.text
        data = r.json()
        a = data.get("assessment")
        assert a is not None, "assessment not returned"
        assert a["overall_level"] in ("LOW", "MODERATE", "HIGH", "CRITICAL")
        assert isinstance(a["overall_score"], int)
        assert isinstance(a["scores"], list) and len(a["scores"]) == 5
        for s in a["scores"]:
            assert s["category"] and s["level"] in ("LOW", "MODERATE", "HIGH", "CRITICAL")
        assert isinstance(a["recommendations"], list) and len(a["recommendations"]) >= 3
        assert isinstance(a["emergency_contacts"], list)
        assert isinstance(data["alerts"], list)

    def test_refresh_alerts(self, client, auth_headers, itinerary_id):
        r = client.post(f"{API}/itineraries/{itinerary_id}/refresh-alerts",
                        headers=auth_headers, timeout=90)
        assert r.status_code == 200, r.text
        assert isinstance(r.json()["alerts"], list)

    def test_update_debrief_persists(self, client, auth_headers, itinerary_id):
        text = "TEST debrief: trip completed without incident."
        r = client.put(f"{API}/itineraries/{itinerary_id}/debrief",
                       headers=auth_headers, json={"debrief": text})
        assert r.status_code == 200
        # verify persisted
        r2 = client.get(f"{API}/itineraries/{itinerary_id}", headers=auth_headers)
        assert r2.json()["debrief"] == text

    def test_dashboard_stats(self, client, auth_headers):
        r = client.get(f"{API}/dashboard/stats", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        for k in ("total_itineraries", "active", "planned", "completed", "total_alerts", "critical_alerts"):
            assert k in data
        assert data["total_itineraries"] >= 1


class TestItineraryDelete:
    def test_delete_and_404(self, client, auth_headers):
        # Create disposable
        r = client.post(f"{API}/itineraries", headers=auth_headers, json={
            "traveler_name": "TEST Del", "destination_country": "Japan",
            "destination_city": "Tokyo", "purpose": "tourism",
            "start_date": "2026-03-01", "end_date": "2026-03-05"
        })
        assert r.status_code == 200
        iid = r.json()["id"]
        d = client.delete(f"{API}/itineraries/{iid}", headers=auth_headers)
        assert d.status_code == 200
        # confirm deletion
        g = client.get(f"{API}/itineraries/{iid}", headers=auth_headers)
        assert g.status_code == 404
