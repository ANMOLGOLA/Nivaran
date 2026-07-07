# Phase 2: AI Assistant & RAG - Context

**Gathered:** 2026-07-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Build a floating conversational AI widget on the React citizen dashboard that communicates with the Express backend on port 5000 to detect language, translate queries, search seeded welfare schemes (RAG), play responses via speech synthesis (TTS), record user voice inputs (STT), and offer agentic redirect prompts when civic complaints are detected.

</domain>

<spec_lock>
## Requirements (locked via SPEC.md)

**5 requirements are locked.** See `02-SPEC.md` for full requirements, boundaries, and acceptance criteria.

Downstream agents MUST read `02-SPEC.md` before planning or implementing. Requirements are not duplicated here.

**In scope (from SPEC.md):**
- Chat widget floating panel UI with suggestion chips.
- Backend `/api/ai/chat` endpoint with translation and LLM query processing.
- Seeded RAG scheme data index containing PM-KISAN, Ayushman Bharat, and PMAY details.
- Voice recorder input button (STT) and speech synthesis message buttons (TTS).
- Custom redirect callback cards in chat to trigger complaint wizard.

**Out of scope (from SPEC.md):**
- Real database indexing for all 100+ government welfare schemes.
- Multi-user vector database server deployment.
- Real WhatsApp number verify APIs.

</spec_lock>

<decisions>
## Implementation Decisions

### AI Chat Interface & Layout
- **D-01:** Floating trigger button in bottom-right corner of screen opens a responsive chat bubble container over the dashboard.
- **D-02:** Includes 3 prompt suggestion chips at startup: "Check PM-KISAN Eligibility", "File Civic Complaint", "How to apply for PMAY".

### Translation & Multilingual Gating
- **D-03:** The Express backend will intercept messages. If a message contains non-ASCII characters, it utilizes a lightweight language detection model or checks characters to translate via Google Translate API (or a fallback translator utility) before querying the core LLM in English.
- **D-04:** The final LLM response is translated back into the user's input language before being returned to the client.

### RAG Search Indexing
- **D-05:** Seed 3 text/JSON files containing detailed policy documentation for PM-KISAN, Ayushman Bharat, and PMAY in `backend/src/data/schemes/`.
- **D-06:** Query matching is performed using an in-memory keyword/regex search (supporting simple TF-IDF ranking) to retrieve context blocks and supply them to the LLM context along with explicit citations.

### STT & TTS Audio Integration
- **D-07:** Voice inputs are recorded on the client using the browser's `MediaRecorder` API, sending audio chunks in `audio/wav` format to `/api/ai/stt` for translation/transcription.
- **D-08:** TTS utilizes the browser's native Web Speech API (`window.speechSynthesis`) on the client to speak responses aloud, avoiding additional external API costs.

### Agentic Complaint Redirection
- **D-09:** The LLM is instructed to return a structured JSON response if the user intent is to file a complaint (e.g. `{"text": "...", "redirect": "file-complaint", "suggestedFields": {"description": "water leak"}}`).
- **D-10:** Tapping the returned callback action button redirects the citizen's dashboard view to the complaint wizard.

### the agent's Discretion
- Choice of specific language detection libraries (e.g. `languagedetect`).
- Layout structure of prompt suggestion chips and colors (styled with tricolor-inspired accents).
- Local fallback rules for LLM/RAG responses if API keys are missing during demo runs.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Definitions
- [.planning/PROJECT.md](file:///d:/Projects/Civic%20Platform/.planning/PROJECT.md) — Base stack definitions
- [.planning/REQUIREMENTS.md](file:///d:/Projects/Civic%20Platform/.planning/REQUIREMENTS.md) — Traceability requirements
- [.planning/phases/02-ai-assistant/02-SPEC.md](file:///d:/Projects/Civic%20Platform/.planning/phases/02-ai-assistant/02-SPEC.md) — Locked requirements spec

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- [Login.tsx](file:///d:/Projects/Civic%20Platform/frontend/src/pages/Login.tsx): Reuses framer-motion animations, toast notifications (`Sonner`), and Lucide icons to align styling.
- [App.tsx](file:///d:/Projects/Civic%20Platform/frontend/src/App.tsx): Mounts the floating chat widget on the verified citizen dashboard view.

### Established Patterns
- Express backend endpoints are grouped under `/api/auth` with controllers. We will place the AI routes under `/api/ai` with `ai.controller.ts`.

### Integration Points
- Frontend client queries `POST /api/ai/chat` for dialog inputs.
- Voice record inputs post to `POST /api/ai/stt`.

</code_context>

<specifics>
## Specific Ideas
- Simple pre-defined fallback replies if LLM API keys are missing to ensure a working demonstration for offline/local run testing.

</specifics>

<deferred>
## Deferred Ideas
- Real integration with DigiLocker.
- Offline-first PWA caching for audio logs.

</deferred>

---

*Phase: 02-ai-assistant*
*Context gathered: 2026-07-07*
