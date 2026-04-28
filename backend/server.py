from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import logging
import asyncio
import uuid
import bcrypt
import jwt
import resend
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta

from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALG = "HS256"
JWT_EXP_DAYS = 7

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
CONTACT_INBOX = os.environ.get('CONTACT_INBOX', 'contact@example.com')

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="Global Intel Desk API")
api_router = APIRouter(prefix="/api")
bearer = HTTPBearer(auto_error=False)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ==================== Models ====================
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str
    organization: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    organization: Optional[str] = None
    created_at: str


class AuthResponse(BaseModel):
    token: str
    user: UserOut


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    phone: Optional[str] = None
    message: str


class ItineraryCreate(BaseModel):
    traveler_name: str
    destination_country: str
    destination_city: str
    purpose: str  # business, diplomatic, tourism, humanitarian
    start_date: str  # ISO date
    end_date: str
    notes: Optional[str] = None


class RiskScore(BaseModel):
    category: str
    score: int  # 0-100, higher = more risk
    level: str  # LOW, MODERATE, HIGH, CRITICAL
    summary: str


class RiskAssessment(BaseModel):
    overall_level: str
    overall_score: int
    scores: List[RiskScore]
    recommendations: List[str]
    emergency_contacts: List[str]
    generated_at: str


class ThreatAlert(BaseModel):
    id: str
    severity: str  # LOW, MODERATE, HIGH, CRITICAL
    category: str
    headline: str
    detail: str
    timestamp: str


class ItineraryOut(BaseModel):
    id: str
    user_id: str
    traveler_name: str
    destination_country: str
    destination_city: str
    purpose: str
    start_date: str
    end_date: str
    notes: Optional[str] = None
    status: str  # planned, active, completed
    created_at: str
    assessment: Optional[RiskAssessment] = None
    alerts: List[ThreatAlert] = []
    debrief: Optional[str] = None


class DebriefUpdate(BaseModel):
    debrief: str


# ==================== Auth Helpers ====================
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode(), hashed.encode())
    except Exception:
        return False


def create_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=JWT_EXP_DAYS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


async def get_current_user(creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer)) -> dict:
    if not creds:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALG])
        user_id = payload.get("sub")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


def user_doc_to_out(user: dict) -> UserOut:
    return UserOut(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        organization=user.get("organization"),
        created_at=user["created_at"],
    )


# ==================== Routes: Health ====================
@api_router.get("/")
async def root():
    return {"service": "Global Intel Desk API", "status": "operational"}


# ==================== Routes: Auth ====================
@api_router.post("/auth/register", response_model=AuthResponse)
async def register(req: RegisterRequest):
    existing = await db.users.find_one({"email": req.email.lower()}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    user = {
        "id": user_id,
        "email": req.email.lower(),
        "password_hash": hash_password(req.password),
        "full_name": req.full_name,
        "organization": req.organization,
        "created_at": now,
    }
    await db.users.insert_one(user)
    token = create_token(user_id)
    return AuthResponse(token=token, user=user_doc_to_out(user))


@api_router.post("/auth/login", response_model=AuthResponse)
async def login(req: LoginRequest):
    user = await db.users.find_one({"email": req.email.lower()}, {"_id": 0})
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(user["id"])
    return AuthResponse(token=token, user=user_doc_to_out(user))


@api_router.get("/auth/me", response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return user_doc_to_out(user)


# ==================== Routes: Contact ====================
async def send_email_safe(to_email: str, subject: str, html: str) -> Optional[str]:
    if not RESEND_API_KEY:
        logger.info(f"[EMAIL MOCK] to={to_email} subj={subject}")
        return None
    params = {"from": SENDER_EMAIL, "to": [to_email], "subject": subject, "html": html}
    try:
        res = await asyncio.to_thread(resend.Emails.send, params)
        return res.get("id") if isinstance(res, dict) else None
    except Exception as e:
        logger.error(f"Email send failed: {e}")
        return None


@api_router.post("/contact")
async def contact(req: ContactRequest):
    doc = {
        "id": str(uuid.uuid4()),
        "name": req.name,
        "email": req.email,
        "company": req.company,
        "phone": req.phone,
        "message": req.message,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.contacts.insert_one(doc)
    html = f"""
    <div style='font-family:Inter,Arial,sans-serif;padding:24px;background:#050505;color:#fff;'>
      <h2 style='color:#fff;border-bottom:1px solid #333;padding-bottom:12px;'>New Intel Desk Inquiry</h2>
      <table cellpadding='8'>
        <tr><td><b>Name</b></td><td>{req.name}</td></tr>
        <tr><td><b>Email</b></td><td>{req.email}</td></tr>
        <tr><td><b>Company</b></td><td>{req.company or '-'}</td></tr>
        <tr><td><b>Phone</b></td><td>{req.phone or '-'}</td></tr>
      </table>
      <p style='margin-top:16px;white-space:pre-wrap;'>{req.message}</p>
    </div>
    """
    email_id = await send_email_safe(CONTACT_INBOX, f"[Global Intel Desk] Inquiry from {req.name}", html)
    return {"status": "received", "id": doc["id"], "email_dispatched": bool(email_id)}


# ==================== Routes: Itineraries ====================
def itinerary_to_out(doc: dict) -> ItineraryOut:
    assessment = None
    if doc.get("assessment"):
        a = doc["assessment"]
        assessment = RiskAssessment(
            overall_level=a["overall_level"],
            overall_score=a["overall_score"],
            scores=[RiskScore(**s) for s in a["scores"]],
            recommendations=a["recommendations"],
            emergency_contacts=a["emergency_contacts"],
            generated_at=a["generated_at"],
        )
    alerts = [ThreatAlert(**al) for al in doc.get("alerts", [])]
    return ItineraryOut(
        id=doc["id"],
        user_id=doc["user_id"],
        traveler_name=doc["traveler_name"],
        destination_country=doc["destination_country"],
        destination_city=doc["destination_city"],
        purpose=doc["purpose"],
        start_date=doc["start_date"],
        end_date=doc["end_date"],
        notes=doc.get("notes"),
        status=doc.get("status", "planned"),
        created_at=doc["created_at"],
        assessment=assessment,
        alerts=alerts,
        debrief=doc.get("debrief"),
    )


def compute_status(start_date: str, end_date: str) -> str:
    try:
        today = datetime.now(timezone.utc).date()
        s = datetime.fromisoformat(start_date).date()
        e = datetime.fromisoformat(end_date).date()
        if today < s:
            return "planned"
        if today > e:
            return "completed"
        return "active"
    except Exception:
        return "planned"


@api_router.post("/itineraries", response_model=ItineraryOut)
async def create_itinerary(req: ItineraryCreate, user: dict = Depends(get_current_user)):
    doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "traveler_name": req.traveler_name,
        "destination_country": req.destination_country,
        "destination_city": req.destination_city,
        "purpose": req.purpose,
        "start_date": req.start_date,
        "end_date": req.end_date,
        "notes": req.notes,
        "status": compute_status(req.start_date, req.end_date),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "assessment": None,
        "alerts": [],
        "debrief": None,
    }
    await db.itineraries.insert_one(doc)
    return itinerary_to_out(doc)


@api_router.get("/itineraries", response_model=List[ItineraryOut])
async def list_itineraries(user: dict = Depends(get_current_user)):
    docs = await db.itineraries.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for d in docs:
        d["status"] = compute_status(d["start_date"], d["end_date"])
    return [itinerary_to_out(d) for d in docs]


@api_router.get("/itineraries/{itin_id}", response_model=ItineraryOut)
async def get_itinerary(itin_id: str, user: dict = Depends(get_current_user)):
    doc = await db.itineraries.find_one({"id": itin_id, "user_id": user["id"]}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    doc["status"] = compute_status(doc["start_date"], doc["end_date"])
    return itinerary_to_out(doc)


@api_router.delete("/itineraries/{itin_id}")
async def delete_itinerary(itin_id: str, user: dict = Depends(get_current_user)):
    res = await db.itineraries.delete_one({"id": itin_id, "user_id": user["id"]})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return {"status": "deleted"}


# ==================== AI: Risk Assessment ====================
ASSESSMENT_SYSTEM = """You are an elite geopolitical intelligence analyst producing travel risk briefings for a corporate security firm (Global Intel Desk). You will be given a traveler's itinerary. Produce a realistic, balanced, actionable risk assessment.

You MUST respond with ONLY a valid JSON object in this exact shape (no markdown, no code fences, no prose):

{
  "overall_level": "LOW|MODERATE|HIGH|CRITICAL",
  "overall_score": 0-100,
  "scores": [
    {"category":"Political Stability","score":0-100,"level":"LOW|MODERATE|HIGH|CRITICAL","summary":"1-2 sentence briefing"},
    {"category":"Crime & Security","score":0-100,"level":"LOW|MODERATE|HIGH|CRITICAL","summary":"..."},
    {"category":"Health & Medical","score":0-100,"level":"LOW|MODERATE|HIGH|CRITICAL","summary":"..."},
    {"category":"Natural Hazards","score":0-100,"level":"LOW|MODERATE|HIGH|CRITICAL","summary":"..."},
    {"category":"Infrastructure & Travel","score":0-100,"level":"LOW|MODERATE|HIGH|CRITICAL","summary":"..."}
  ],
  "recommendations": ["actionable recommendation 1","...","..."],
  "emergency_contacts": ["Local emergency services: 112","Nearest embassy/consulate note","Medical evacuation contact"]
}

Higher score = higher risk. Be specific to the destination, city, and travel purpose. Provide 5-7 recommendations."""


async def generate_assessment(itin: dict) -> dict:
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=503, detail="LLM key not configured")
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"assessment-{itin['id']}",
        system_message=ASSESSMENT_SYSTEM,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    prompt = (
        f"Traveler: {itin['traveler_name']}\n"
        f"Destination: {itin['destination_city']}, {itin['destination_country']}\n"
        f"Purpose: {itin['purpose']}\n"
        f"Dates: {itin['start_date']} to {itin['end_date']}\n"
        f"Notes: {itin.get('notes') or 'none'}\n\n"
        "Produce the JSON risk assessment now."
    )
    try:
        raw = await chat.send_message(UserMessage(text=prompt))
    except Exception as e:
        logger.error(f"LLM call failed: {e}")
        raise HTTPException(status_code=502, detail="Intelligence engine unavailable")

    text = raw.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]
        text = text.strip()
    # find JSON braces
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        raise HTTPException(status_code=502, detail="Malformed assessment response")
    try:
        data = json.loads(text[start : end + 1])
    except Exception as e:
        logger.error(f"JSON parse failed: {e}; text={text[:400]}")
        raise HTTPException(status_code=502, detail="Malformed assessment response")
    data["generated_at"] = datetime.now(timezone.utc).isoformat()
    return data


ALERTS_SYSTEM = """You are an intelligence operations officer generating plausible real-time threat alerts for a traveler's itinerary. Produce 3-5 alerts relevant to the destination and dates.

Respond with ONLY a valid JSON array, no markdown:

[
  {"severity":"LOW|MODERATE|HIGH|CRITICAL","category":"Political|Crime|Health|Weather|Transport|Cyber","headline":"short headline","detail":"1-2 sentence detail"}
]

Be specific to destination. Mix severities realistically."""


async def generate_alerts(itin: dict) -> List[dict]:
    if not EMERGENT_LLM_KEY:
        return []
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"alerts-{itin['id']}-{uuid.uuid4().hex[:8]}",
        system_message=ALERTS_SYSTEM,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    prompt = (
        f"Destination: {itin['destination_city']}, {itin['destination_country']}. "
        f"Dates: {itin['start_date']} to {itin['end_date']}. "
        f"Purpose: {itin['purpose']}. Generate alerts now."
    )
    try:
        raw = await chat.send_message(UserMessage(text=prompt))
    except Exception as e:
        logger.error(f"Alerts LLM failed: {e}")
        return []
    text = raw.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]
        text = text.strip()
    start = text.find("[")
    end = text.rfind("]")
    if start == -1 or end == -1:
        return []
    try:
        arr = json.loads(text[start : end + 1])
    except Exception:
        return []
    now = datetime.now(timezone.utc)
    out = []
    for i, a in enumerate(arr):
        out.append({
            "id": str(uuid.uuid4()),
            "severity": a.get("severity", "LOW"),
            "category": a.get("category", "General"),
            "headline": a.get("headline", ""),
            "detail": a.get("detail", ""),
            "timestamp": (now - timedelta(minutes=i * 27)).isoformat(),
        })
    return out


@api_router.post("/itineraries/{itin_id}/assess", response_model=ItineraryOut)
async def assess_itinerary(itin_id: str, user: dict = Depends(get_current_user)):
    doc = await db.itineraries.find_one({"id": itin_id, "user_id": user["id"]}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    assessment = await generate_assessment(doc)
    alerts = await generate_alerts(doc)
    await db.itineraries.update_one(
        {"id": itin_id, "user_id": user["id"]},
        {"$set": {"assessment": assessment, "alerts": alerts}},
    )
    doc["assessment"] = assessment
    doc["alerts"] = alerts
    doc["status"] = compute_status(doc["start_date"], doc["end_date"])
    return itinerary_to_out(doc)


@api_router.post("/itineraries/{itin_id}/refresh-alerts", response_model=ItineraryOut)
async def refresh_alerts(itin_id: str, user: dict = Depends(get_current_user)):
    doc = await db.itineraries.find_one({"id": itin_id, "user_id": user["id"]}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    alerts = await generate_alerts(doc)
    await db.itineraries.update_one(
        {"id": itin_id, "user_id": user["id"]},
        {"$set": {"alerts": alerts}},
    )
    doc["alerts"] = alerts
    doc["status"] = compute_status(doc["start_date"], doc["end_date"])
    return itinerary_to_out(doc)


@api_router.put("/itineraries/{itin_id}/debrief", response_model=ItineraryOut)
async def update_debrief(itin_id: str, req: DebriefUpdate, user: dict = Depends(get_current_user)):
    res = await db.itineraries.update_one(
        {"id": itin_id, "user_id": user["id"]},
        {"$set": {"debrief": req.debrief}},
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    doc = await db.itineraries.find_one({"id": itin_id, "user_id": user["id"]}, {"_id": 0})
    doc["status"] = compute_status(doc["start_date"], doc["end_date"])
    return itinerary_to_out(doc)


# ==================== Dashboard Stats ====================
@api_router.get("/dashboard/stats")
async def dashboard_stats(user: dict = Depends(get_current_user)):
    docs = await db.itineraries.find({"user_id": user["id"]}, {"_id": 0}).to_list(500)
    active = planned = completed = 0
    total_alerts = critical_alerts = 0
    for d in docs:
        s = compute_status(d["start_date"], d["end_date"])
        if s == "active":
            active += 1
        elif s == "planned":
            planned += 1
        else:
            completed += 1
        for a in d.get("alerts", []):
            total_alerts += 1
            if a.get("severity") in ("HIGH", "CRITICAL"):
                critical_alerts += 1
    return {
        "total_itineraries": len(docs),
        "active": active,
        "planned": planned,
        "completed": completed,
        "total_alerts": total_alerts,
        "critical_alerts": critical_alerts,
    }


# ==================== Wire up ====================
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
