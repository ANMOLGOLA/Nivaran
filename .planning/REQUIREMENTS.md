# Requirements: Smart Bharat

**Defined:** 2026-07-07
**Core Value:** Empower every Indian citizen to resolve civic issues and access government schemes easily in their own language, even in low-connectivity areas.

## v1 Requirements

### Authentication & Access (AUTH)
- [ ] **AUTH-01**: User can log in/sign up using an OTP-based phone login (mocked for demo).
- [ ] **AUTH-02**: Support role-based access for Citizen, Department Officer, and Admin.
- [ ] **AUTH-03**: Securely handle PII (Aadhaar, ration cards) by masking/hashing them at rest.

### AI Assistant (AI)
- [ ] **AI-01**: Persistent conversational chat widget with suggested action chips.
- [ ] **AI-02**: Grounded RAG answers about government schemes and documents, citing sources.
- [ ] **AI-03**: Support voice-to-text (STT) and text-to-speech (TTS) for voice-first interactions.
- [ ] **AI-04**: Automatically detect input language and reply in the same language.
- [ ] **AI-05**: Proactive agentic suggestion (e.g. starting a scheme application or complaint).

### Government Services Directory (DIR)
- [ ] **DIR-01**: Card-based searchable and filterable catalog of government schemes.
- [ ] **DIR-02**: Conversational AI-powered eligibility checker with explainable results.
- [ ] **DIR-03**: Generate downloadable document checklists for schemes as PDF.

### Report Public Issues (REP)
- [ ] **REP-01**: Multi-modal complaint filing (photo upload + description + voice note + GPS geolocation).
- [ ] **REP-02**: AI auto-categorizes issue from photo or text description.
- [ ] **REP-03**: Duplicate detection to cluster complaints within 100m radius into single ticket with priority counters.
- [ ] **REP-04**: Auto-routing complaints to correct departments and generating estimated SLAs.

### Track & Escalate (TRK)
- [ ] **TRK-01**: Timeline tracking view of complaint status (Filed → Acknowledged → Assigned → In Progress → Resolved).
- [ ] **TRK-02**: WhatsApp/SMS simulation notifications for status updates.
- [ ] **TRK-03**: AI auto-drafts escalation letter/RTI if SLA deadline is exceeded.
- [ ] **TRK-04**: Citizens can rate resolution quality.

### Public Accountability Dashboard (DASH)
- [ ] **DASH-01**: Public dashboard showing metrics (average resolution time by department/ward, total stats).
- [ ] **DASH-02**: Heatmap visualization of complaints by density and category.

### Accessibility (ACC)
- [ ] **ACC-01**: Offline-first support (PWA caching) queuing complaints when signal is lost.
- [ ] **ACC-02**: Multilingual layout support (at least 8 Indian languages: Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada, Punjabi).

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
| AUTH-01     | Phase 1 | Pending |
| AUTH-02     | Phase 1 | Pending |
| AUTH-03     | Phase 1 | Pending |
| AI-01       | Phase 2 | Pending |
| AI-02       | Phase 2 | Pending |
| AI-03       | Phase 2 | Pending |
| AI-04       | Phase 2 | Pending |
| AI-05       | Phase 2 | Pending |
| DIR-01      | Phase 3 | Pending |
| DIR-02      | Phase 3 | Pending |
| DIR-03      | Phase 3 | Pending |
| REP-01      | Phase 4 | Pending |
| REP-02      | Phase 4 | Pending |
| REP-03      | Phase 4 | Pending |
| REP-04      | Phase 4 | Pending |
| TRK-01      | Phase 5 | Pending |
| TRK-02      | Phase 5 | Pending |
| TRK-03      | Phase 5 | Pending |
| TRK-04      | Phase 5 | Pending |
| DASH-01     | Phase 6 | Pending |
| DASH-02     | Phase 6 | Pending |
| ACC-01      | Phase 7 | Pending |
| ACC-02      | Phase 7 | Pending |

**Coverage:**
- v1 requirements: 23 total
- Mapped to phases: 23
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-07*
*Last updated: 2026-07-07 after initialization*
