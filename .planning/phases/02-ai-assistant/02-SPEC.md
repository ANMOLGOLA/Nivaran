# Phase 2: AI Assistant & RAG — Specification

**Created:** 2026-07-07
**Ambiguity score:** 0.10 (gate: ≤ 0.20)
**Requirements:** 5 locked

## Goal

Citizens can converse with a multilingual AI companion via text or voice to get RAG-grounded answers about government schemes and receive proactive suggestions to file complaints or apply for services.

## Background

Phase 1 established the backend Node/Express server with SQLite database models and the React/Vite/Tailwind v4 frontend. Currently, no conversational interface, speech integration, translation capabilities, or scheme documents exist. This phase implements the full AI integration: a floating frontend chat widget, backend chat endpoint with translation and RAG search, and mock or API-based speech-to-text (STT) and text-to-speech (TTS) interfaces.

## Requirements

1. **AI Chat Widget**: Render a persistent floating chat button on the dashboard that opens a conversational interface.
   - Current: No chat UI exists. The dashboard is static.
   - Target: A floating toggle button on the bottom right of the screen. Tapping it opens a slide-over/popover chat window showing a message history thread and suggested prompt chips (e.g., "Check PM-KISAN Eligibility").
   - Acceptance: Clicking the floating button opens the panel. Clicking a suggested prompt chip populates the input bar and submits the query.

2. **Multilingual Auto-detection & Translation**: AI companion detects input language and replies in the same language.
   - Current: User has a static `languagePref` field in the database, but no translation logic exists.
   - Target: Backend `/api/ai/chat` endpoint detects the message language (supporting Hindi, Tamil, Telugu, and English at a minimum) and translates the query to English (the LLM's primary RAG language) if needed, then translates the final response back to the detected language.
   - Acceptance: Sending a message like "नमस्ते" (Hindi) or "வணக்கம்" (Tamil) returns a response translated into that respective language.

3. **RAG-Grounded Scheme Answers**: AI matches query against seeded welfare schemes and answers with named citations.
   - Current: No welfare scheme documents exist in the system.
   - Target: Seeded JSON/Markdown files for 3 major Indian welfare schemes (e.g., PM-KISAN, Ayushman Bharat, Pradhan Mantri Awas Yojana). Backend retrieves matching paragraphs using keyword (BM25 or simple text regex ranking) and injects them into the LLM context to generate responses that cite sources.
   - Acceptance: Asking "Am I eligible for health cover?" returns eligibility terms directly quoted from the Ayushman Bharat document and cites "Ayushman Bharat" as the source.

4. **Speech-to-Text & Text-to-Speech**: Support voice inputs and spoken text audio playback.
   - Current: No voice capabilities exist.
   - Target: A microphone icon button in the chat input. Recording voice captures audio, sends it to `/api/ai/stt`, and populates the text input. A speaker icon button on AI message blocks calls `/api/ai/tts` (or uses Web Speech API) to read the response aloud.
   - Acceptance: Clicking the speaker icon reads the message using the browser's speechSynthesis or returns a playable audio payload; microphone recording successfully converts speech into text.

5. **Proactive Agentic Suggestion**: Trigger structured redirection actions from conversation intent.
   - Current: Chat messages are plain text.
   - Target: If the AI detects a complaint intent (e.g., "street light is broken on my road"), it appends a structured Action Button (e.g., "File Complaint") in the message bubble. Tapping it redirects the user to the complaint wizard.
   - Acceptance: Messaging "garbage is piled up in my street" returns an AI reply featuring a "File Complaint" action link that opens the complaint submission dialog.

## Boundaries

**In scope:**
- Chat widget floating panel UI with suggestion chips.
- Backend `/api/ai/chat` endpoint with mock/API translation and LLM integration.
- Grounded RAG index containing PM-KISAN, Ayushman Bharat, and PMAY scheme documents.
- Voice recorder input button (STT) and text-to-speech message speaker buttons (TTS).
- Redirection links/buttons in chat to file complaints or check eligibility.

**Out of scope:**
- Real database integration for all 100+ national government schemes (demo limited to 3 seeded core schemes).
- Multi-user concurrent vector database deployment (local SQLite-based indexing/regex matching is sufficient).
- Real-world WhatsApp number verification integration (simulated inside dashboard).

## Constraints

- Conversational response latency must remain under 3 seconds.
- Voice recordings must support standard Web Audio APIs (MIME type `audio/webm` or `audio/wav`).
- Must handle fallback gracefully if translation/LLM API credentials are not set (by using a pre-defined fallback rule engine).

## Acceptance Criteria

- [ ] Floating chat button toggles the slide-over chat view open and closed.
- [ ] Clicking quick prompt chips executes the query directly.
- [ ] Indian language inputs (Hindi/Tamil) receive responses in the correct language.
- [ ] RAG queries cite seeded welfare documents correctly.
- [ ] Speaker icon triggers TTS audio playback.
- [ ] Complaint-based message intent returns a clickable "File Complaint" action button.

## Ambiguity Report

| Dimension          | Score | Min  | Status | Notes                              |
|--------------------|-------|------|--------|------------------------------------|
| Goal Clarity       | 0.90  | 0.75 | ✓      | Focus on multilingual RAG chat.    |
| Boundary Clarity   | 0.90  | 0.70 | ✓      | Out-of-scope items explicitly listed.|
| Constraint Clarity | 0.90  | 0.65 | ✓      | Max latency and audio formats set. |
| Acceptance Criteria| 0.90  | 0.70 | ✓      | 6 pass/fail checkboxes defined.    |
| **Ambiguity**      | 0.10  | ≤0.20| ✓      |                                    |

Status: ✓ = met minimum, ⚠ = below minimum (planner treats as assumption)

## Interview Log

| Round | Perspective    | Question summary         | Decision locked                    |
|-------|----------------|-------------------------|------------------------------------|
| 1     | Researcher     | What exists in codebase? | Only Auth boilerplate; no AI parts. |
| 2     | Simplifier     | Minimum viable AI?      | 3 seeded schemes, text/voice, fallback rules if API key missing. |
| 3     | Boundary Keeper| Out of scope limits?    | No real WhatsApp, no full scheme vector store. |

---

*Phase: 02-ai-assistant*
*Spec created: 2026-07-07*
*Next step: /gsd-discuss-phase 2 — implementation decisions (how to build what's specified above)*
