# Global Intel Desk — Product Requirements Document

## Original Problem Statement
Build a website for "Itinerary-Based Monitoring" — a travel security intelligence service that secures travelers in high-risk environments (business trips, diplomatic missions, high-risk destinations). Four-phase operation: Destination & Route Assessment → Real-Time Threat Alerts → Emergency Protocols → Post-Travel Debriefings. Backed by advanced intelligence gathering, robust emergency protocols, and 24/7 client support.

## User Choices
- **App type:** Full SaaS dashboard
- **Branding:** Corporate & trustworthy (Mission Control aesthetic)
- **Brand name:** Global Intel Desk
- **Integrations:** Contact form with email delivery (Resend), AI-powered travel risk assessment (Claude Sonnet 4.5 via Emergent LLM key)

## Architecture
- **Backend:** FastAPI + Motor (MongoDB async), JWT auth (bcrypt), emergentintegrations (Claude Sonnet 4.5), Resend for email
- **Frontend:** React 19 + React Router 7, Shadcn UI (dark theme), Tailwind, Sonner toasts, lucide-react icons
- **Design:** Chivo (display), Inter (body), JetBrains Mono (data); #050505 base, white/red/amber/green functional color; sharp corners; 1px borders

## User Personas
- Corporate security managers arranging executive travel
- Diplomatic and NGO operations officers
- Media / journalist deployment coordinators
- Individual high-net-worth travelers requiring duty-of-care

## Implemented — 2026-02-28 (v1.0 MVP)
### Marketing site
- `/` Home: hero with topographic map bg, live intel ticker, 4-step protocol grid, why-choose features, CTA band
- `/services` Services: 4 protocol rows + always-on support matrix
- `/about` About: founder mandate, 4-stat grid, 3 operating principles
- `/contact` Contact: crisis line, secure inquiry form → POST `/api/contact` (stored in DB + Resend email when key set)

### Auth
- `/register` — JWT-based register (bcrypt password hash)
- `/login` — JWT-based login
- ProtectedRoute gate for dashboard

### Dashboard (authenticated)
- `/dashboard` — stats cards (total, active, alerts, critical) + itinerary card grid
- `/dashboard/new` — itinerary creation form (traveler, destination city/country, purpose, dates, notes). Auto-runs AI assessment on submit
- `/dashboard/itinerary/:id` — Full mission file with:
  - AI risk assessment (5 category scores + bars, overall level, recommendations, emergency contacts)
  - Live threat alerts feed (severity-colored) with refresh
  - Emergency protocols panel (P-01 … P-05) + crisis line
  - Post-travel debriefing textarea (persisted)
  - Re-assess / Delete actions

### Backend endpoints
- `GET /api/` · health
- `POST /api/auth/register · login` · `GET /api/auth/me`
- `POST /api/contact`
- `POST/GET/DELETE /api/itineraries` (+ `/:id`)
- `POST /api/itineraries/:id/assess`
- `POST /api/itineraries/:id/refresh-alerts`
- `PUT /api/itineraries/:id/debrief`
- `GET /api/dashboard/stats`

## Testing
- Backend: 18/18 pytest endpoints pass
- Frontend: 12/12 Playwright flows pass (iteration_1.json)

## Backlog / Next Tasks
### P0
- None blocking

### P1
- Wire Resend API key from user (env key intentionally empty; emails currently logged only)
- Add team/multi-operator support (orgs, roles) so multiple analysts can share itineraries
- Email/SMS push of CRITICAL alerts (ties into Resend + Twilio)
- Country risk heat-map on dashboard (world map component)
- Export mission briefing as PDF

### P2
- Calendar view of itineraries (Shadcn calendar)
- Slack/Teams webhook integrations for threat alerts
- Stripe retainer billing for clients
- Embassy / consulate lookup auto-populate in emergency_contacts
- Multi-language UI (ES, FR, AR)
- Activity audit log
- Threat alert proximity map (destination-to-event distance)
