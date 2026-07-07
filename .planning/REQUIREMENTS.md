# Requirements: Smart Bharat

**Defined:** 2026-07-07
**Core Value:** Empower every Indian citizen to resolve civic issues and access government schemes easily in their own language, even in low-connectivity areas.

## v1 Requirements

### Authentication & Access (AUTH)
- [x] **AUTH-01**: User can log in/sign up using Google OAuth via Firebase with a fallback.
- [x] **AUTH-02**: Support role-based access for Citizen, Department Officer, and Admin.
- [x] **AUTH-03**: Securely handle PII (Aadhaar, ration cards) by masking/hashing them at rest.

### AI Assistant (AI)
- [x] **AI-01**: Persistent conversational chat widget with suggested action chips.
- [x] **AI-02**: Grounded RAG answers about government schemes and documents, citing sources.
- [x] **AI-03**: Support voice-to-text (STT) and text-to-speech (TTS) for voice-first interactions.
- [x] **AI-04**: Automatically detect input language and reply in the same language.
- [x] **AI-05**: Proactive agentic suggestion (e.g. starting a scheme application or complaint).

### Government Services Directory (DIR)
- [x] **DIR-01**: Card-based searchable and filterable catalog of government schemes.
- [x] **DIR-02**: Conversational AI-powered eligibility checker with explainable results.
- [x] **DIR-03**: Generate downloadable document checklists for schemes.

### Report Public Issues (REP)
- [x] **REP-01**: Multi-modal complaint filing (photo upload + description + voice note + GPS geolocation).
- [x] **REP-02**: AI auto-categorizes issue from photo or text description.
- [x] **REP-03**: Duplicate detection to cluster complaints within 100m radius into single ticket with priority counters.
- [x] **REP-04**: Auto-routing complaints to correct departments and generating estimated SLAs.

### Track & Escalate (TRK)
- [x] **TRK-01**: Timeline tracking view of complaint status (Filed → Acknowledged → Assigned → In Progress → Resolved).
- [x] **TRK-02**: WhatsApp/SMS simulation notifications for status updates.
- [x] **TRK-03**: AI auto-drafts escalation letter/RTI if SLA deadline is exceeded.
- [x] **TRK-04**: Citizens can rate resolution quality.

### Public Accountability Dashboard (DASH)
- [x] **DASH-01**: Public dashboard showing metrics (average resolution time by department/ward, total stats).
- [x] **DASH-02**: Heatmap visualization of complaints by density and category.

### Accessibility (ACC)
- [x] **ACC-01**: Offline-first support (PWA caching) queuing complaints when signal is lost.
- [x] **ACC-02**: Multilingual layout support (at least 8 Indian languages: Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada, Punjabi).

## v2 Requirements
- **INT-01**: Real integration with DigiLocker API.
- **INT-02**: Live integration with UMANG service APIs.

## Out of Scope
| Feature | Reason |
|---------|--------|
| Real Payment Processing | Out of scope for hackathon demo; mock transactions if needed. |
| Live Municipality APIs | No real government system APIs exist for writable sandboxes; mocked/simulated municipality portal. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01     | Phase 1 | Completed |
| AUTH-02     | Phase 1 | Completed |
| AUTH-03     | Phase 1 | Completed |
| AI-01       | Phase 2 | Completed |
| AI-02       | Phase 2 | Completed |
| AI-03       | Phase 2 | Completed |
| AI-04       | Phase 2 | Completed |
| AI-05       | Phase 2 | Completed |
| DIR-01      | Phase 3 | Completed |
| DIR-02      | Phase 3 | Completed |
| DIR-03      | Phase 3 | Completed |
| REP-01      | Phase 3 | Completed |
| REP-02      | Phase 3 | Completed |
| REP-03      | Phase 3 | Completed |
| REP-04      | Phase 3 | Completed |
| TRK-01      | Phase 4 | Completed |
| TRK-02      | Phase 4 | Completed |
| TRK-03      | Phase 4 | Completed |
| TRK-04      | Phase 4 | Completed |
| DASH-01     | Phase 4 | Completed |
| DASH-02     | Phase 4 | Completed |
| ACC-01      | Phase 4 | Completed |
| ACC-02      | Phase 4 | Completed |

**Coverage:**
- v1 requirements: 23 total
- Mapped to phases: 23
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-07*
*Last updated: 2026-07-07 after initialization*
