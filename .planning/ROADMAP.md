# Roadmap: Smart Bharat

## Overview
This roadmap lays out the development phases for Smart Bharat: AI-Powered Civic Companion, taking it from a clean full-stack foundation to a feature-rich, accessible civic platform with real-time AI assistance, geolocation clustering, and a public accountability dashboard.

## Phases

- [x] **Phase 1: Foundation & Auth** - Set up the boilerplate React Vite/Express backend, database schemas, and mocked OTP authentication.
- [x] **Phase 2: AI Assistant & RAG** - Implement conversational RAG-grounded chat with multilingual voice interaction.
- [ ] **Phase 3: Issues Reporting & PostGIS** - Build complaint filing with media upload and PostGIS-based duplicate clustering.
- [ ] **Phase 4: Tracking & Dashboard** - Implement SLA tracking, escalation auto-drafting, PWA support, and public metrics dashboard.

## Phase Details

### Phase 1: Foundation & Auth
**Goal**: Build a working full-stack boilerplate with OTP authentication.
**Depends on**: Nothing
**Requirements**: AUTH-01, AUTH-02, AUTH-03
**Success Criteria**:
  1. Citizen and Officer roles can login using OTP verification (mocked).
  2. Database tables (Users, Schemes, Complaints) are created.
  3. Sensitive user information is masked or hashed at rest.
**Plans**: 1 plan

Plans:
- [x] 01-01: Set up React 18, Express backend, PostgreSQL integration, and OTP login page.

---

### Phase 2: AI Assistant & RAG
**Goal**: Integrate conversational AI assistant capable of translating, using voice (STT/TTS), and retrieving schemes using RAG.
**Depends on**: Phase 1
**Requirements**: AI-01, AI-02, AI-03, AI-04, AI-05
**Success Criteria**:
  1. AI assistant responds to citizen inputs and auto-detects language.
  2. Assistant retrieves info from seeded scheme documents and cites sources.
  3. Voice inputs are transcribed to text and assistant reads responses.
**Plans**: 1 plan

Plans:
- [x] 02-01: Build the conversational UI, RAG indexing pipeline, translation integration, and voice STT/TTS widgets.

---

### Phase 3: Issues Reporting & PostGIS
**Goal**: Implement geolocation-based issue reporting with media upload and automatic duplicate clustering.
**Depends on**: Phase 2
**Requirements**: REP-01, REP-02, REP-03, REP-04
**Success Criteria**:
  1. User can file complaints with photo, voice notes, description, and GPS.
  2. AI auto-categorizes incoming complaints based on uploaded image/text.
  3. PostGIS groups complaints within 100 meters into duplicate clusters.
**Plans**: 1 plan

Plans:
- [ ] 03-01: Set up file storage for uploads, implement PostGIS spatial queries, and build issue reporting forms.

---

### Phase 4: Tracking & Dashboard
**Goal**: Track filed complaints, trigger SLA notifications/escalations, and showcase public transparency dashboards.
**Depends on**: Phase 3
**Requirements**: TRK-01, TRK-02, TRK-03, TRK-04, DASH-01, DASH-02, ACC-01, ACC-02
**Success Criteria**:
  1. Citizen tracks status change on timeline and receives simulated WhatsApp/SMS alerts.
  2. Public dashboard showcases heatmaps and average resolution times per ward.
  3. The web app functions offline (PWA) and queues complaints to sync later.
**Plans**: 1 plan

Plans:
- [ ] 04-01: Build tracking timeline, escalation generator, Recharts dashboard with leaflet heatmap, and PWA offline capabilities.

---

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Auth | 1/1 | Completed | 2026-07-07 |
| 2. AI Assistant & RAG | 1/1 | Completed | 2026-07-07 |
| 3. Issues Reporting & PostGIS | 0/1 | Not started | - |
| 4. Tracking & Dashboard | 0/1 | Not started | - |
