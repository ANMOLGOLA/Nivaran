# Roadmap: Smart Bharat

## Overview
This roadmap lays out the development phases for Smart Bharat: AI-Powered Civic Companion, taking it from a clean full-stack foundation to a feature-rich, accessible civic platform with real-time AI assistance, geolocation clustering, and a public accountability dashboard.

## Phases

- [x] **Phase 1: Foundation & Auth** - Set up the boilerplate React Vite/Express backend, database schemas, and Google OAuth via Firebase.
- [x] **Phase 2: AI Assistant & RAG** - Implement conversational RAG-grounded chat with multilingual voice interaction.
- [x] **Phase 3: Issues Reporting** - Build complaint filing with media upload, GPS geolocation, AI categorization, and Haversine duplicate clustering.
- [x] **Phase 4: Tracking & Dashboard** - Implement SLA tracking, escalation auto-drafting, Recharts public metrics dashboard, and Firebase deployment config.

## Phase Details

### Phase 1: Foundation & Auth
**Goal**: Build a working full-stack boilerplate with Google OAuth authentication.
**Depends on**: Nothing
**Requirements**: AUTH-01, AUTH-02, AUTH-03
**Success Criteria**:
  1. ✅ Citizen and Officer roles can login using Google OAuth (Firebase) with demo mode fallback.
  2. ✅ Database tables (Users, Schemes, Complaints) are created.
  3. ✅ Sensitive user information is masked/hashed at rest.
**Plans**: 1 plan

Plans:
- [x] 01-01: Set up React 18, Express backend, SQLite/Prisma, and Google OAuth login page.

---

### Phase 2: AI Assistant & RAG
**Goal**: Integrate conversational AI assistant capable of translating, using voice (STT/TTS), and retrieving schemes using RAG.
**Depends on**: Phase 1
**Requirements**: AI-01, AI-02, AI-03, AI-04, AI-05
**Success Criteria**:
  1. ✅ AI assistant responds to citizen inputs and auto-detects language.
  2. ✅ Assistant retrieves info from seeded scheme documents and cites sources.
  3. ✅ Voice inputs are transcribed to text and assistant reads responses.
**Plans**: 1 plan

Plans:
- [x] 02-01: Build the conversational UI, RAG indexing pipeline, translation integration, and voice STT/TTS widgets.

---

### Phase 3: Issues Reporting
**Goal**: Implement geolocation-based issue reporting with media upload and automatic duplicate clustering.
**Depends on**: Phase 2
**Requirements**: REP-01, REP-02, REP-03, REP-04
**Success Criteria**:
  1. ✅ User can file complaints with photo, voice notes, description, and GPS geolocation.
  2. ✅ AI (Gemini 2.5 Flash) auto-categorizes incoming complaints based on text/description.
  3. ✅ Haversine algorithm clusters complaints within 100 meters into duplicate groups.
  4. ✅ Complaints auto-routed to correct departments with SLA deadlines assigned.
**Plans**: 1 plan

Plans:
- [x] 03-01: Set up complaint filing API, implement Haversine spatial queries, build 5-step issue reporting form with photo/voice/GPS.

---

### Phase 4: Tracking & Dashboard
**Goal**: Track filed complaints, trigger SLA notifications/escalations, and showcase public transparency dashboards.
**Depends on**: Phase 3
**Requirements**: TRK-01, TRK-02, TRK-03, TRK-04, DASH-01, DASH-02, ACC-01, ACC-02
**Success Criteria**:
  1. ✅ Citizen tracks status change on full timeline stepper with SLA countdown.
  2. ✅ Toast notifications simulate WhatsApp/SMS alerts on status changes.
  3. ✅ Gemini auto-drafts RTI/escalation letter when SLA is exceeded.
  4. ✅ Citizens can rate resolution quality (5-star rating widget).
  5. ✅ Public dashboard showcases Recharts charts, average resolution times per ward, KPI cards.
  6. ✅ Animated heatmap placeholder with Google Maps API integration slot.
  7. ✅ Firebase Hosting config + Cloud Run Dockerfile for deployment.
**Plans**: 1 plan

Plans:
- [x] 04-01: Build tracking timeline, Gemini escalation generator, Recharts dashboard, Firebase deployment config.

---

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Auth | 1/1 | ✅ Completed | 2026-07-07 |
| 2. AI Assistant & RAG | 1/1 | ✅ Completed | 2026-07-07 |
| 3. Issues Reporting | 1/1 | ✅ Completed | 2026-07-07 |
| 4. Tracking & Dashboard | 1/1 | ✅ Completed | 2026-07-07 |

**Overall: 4/4 phases complete ✅**
