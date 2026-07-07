# Phase 2: AI Assistant & RAG - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-07
**Phase:** 02-ai-assistant
**Areas discussed:** AI Chat Interface, Multilingual Gating, RAG Search Indexing, STT/TTS Audio, Agentic Redirects

---

## AI Chat Interface & Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Floating Popover/Slide-over | Bottom-right toggle button opens a floating panel overlapping the dashboard. | ✓ |
| Dedicated Chat Page | A full dashboard subpage tab for chatting with the AI. | |

**User's choice:** Floating Popover/Slide-over.
**Notes:** Better accessibility from any section of the dashboard without losing the citizen's context.

---

## Translation & Multilingual Gating

| Option | Description | Selected |
|--------|-------------|----------|
| Client-side Translation | Translate text on client before posting. | |
| Backend-intercept translation | Backend detects language and translates query and response. | ✓ |

**User's choice:** Backend-intercept translation.
**Notes:** Keeps API secrets secure on backend and ensures clean message interfaces.

---

## RAG Search Indexing

| Option | Description | Selected |
|--------|-------------|----------|
| Local SQLite Full-Text / Regex | Read JSON files in memory and use simple text regex matching. | ✓ |
| External Vector Database | Set up a local Chroma/Pinecone docker instance. | |

**User's choice:** Local SQLite Full-Text / Regex.
**Notes:** Excludes deployment overhead for demo runs and guarantees 100% offline capabilities.

---

## STT & TTS Audio Integration

| Option | Description | Selected |
|--------|-------------|----------|
| Native Web Speech API | Client-side native Web Speech API for TTS and native recorder. | ✓ |
| Cloud Speech-to-Text APIs | Server-side cloud transcribers and speech synthesizers. | |

**User's choice:** Native Web Speech API (Client-side native).
**Notes:** Reduces cloud usage bills and runs instantly without complex server audio decoders.

---

## Agentic Complaint Redirection

| Option | Description | Selected |
|--------|-------------|----------|
| Structured JSON redirects | LLM returns structured JSON that React parses into UI action cards. | ✓ |
| Simple text links | LLM outputs Markdown links that redirect. | |

**User's choice:** Structured JSON redirects.
**Notes:** Allows custom UI component styling for redirection cards (tricolor actions).

---

## the agent's Discretion
- Choice of language detection libraries.
- Suggestion chips styling and layouts.
- Fallback mock responses if API keys are missing.

## Deferred Ideas
- Real DigiLocker verification.
- Offline-first PWA caching for voice logs.
