# Smart Bharat: AI-Powered Civic Companion

## What This Is

Smart Bharat is a full-stack, production-grade, GenAI-powered civic engagement platform for Indian citizens. The platform acts as an official-looking, trustworthy, multilingual government digital service accessible to low-literacy, low-bandwidth, and rural users. It features an intelligent AI companion that files, tracks, and escalates public issues, matches citizens with government services, and provides RAG-grounded answers.

## Core Value

Empower every Indian citizen to resolve civic issues and access government schemes easily in their own language, even in low-connectivity areas.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] **AI Assistant (Pillar 1)** — Conversational, multilingual, RAG-grounded chat with voice input/output and agentic action triggers.
- [ ] **Government Services Directory (Pillar 2)** — Scheme catalog with transparent, explainable AI eligibility checker.
- [ ] **Report Public Issues (Pillar 3)** — Complaint filing with photo/voice/geo, auto-routing, and duplicate clustering.
- [ ] **Track Complaints (Pillar 4)** — Status tracking, SLA deadlines, auto-escalation, and citizen satisfaction ratings.
- [ ] **Public Accountability Dashboard** — Heatmap of issue density and department resolution performance.
- [ ] **Accessibility & Reach Layer** — WhatsApp/SMS bot integration and offline-first PWA support.

### Out of Scope

- [ ] Full payment gateways for paid government services (out of scope for hackathon demo).
- [ ] Direct database writing to actual municipality backends (mocked integration/routing for demo).

## Context

- Tech Stack: React 18 (Vite), Tailwind CSS (Navy/Saffron/Green theme), Node.js/Express, PostgreSQL + PostGIS, Redis.
- AI Models: Claude/GPT-4 class models, indicTrans2/Google Translate API for translation, Whisper for voice STT, Tesseract for OCR.
- Targeted at Indian citizens across diverse languages and literacy levels.

## Constraints

- **Design Aesthetic**: Tricolor theme with official-looking Ashoka Chakra animations; must feel trustworthy.
- **Accessibility**: Optimized for 2G/3G speeds; offline-capable PWA.
- **PII Protection**: Sensitive IDs (Aadhaar, ration cards) must be masked/hashed and never stored raw.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| OTP-based Login | Phone numbers are the most accessible form of identity for rural and low-literacy Indian users. | — Pending |
| PostGIS for Geolocation | Critical for grouping complaints into clusters (duplicate detection) within a specific radius (e.g. 100m). | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-07 after initialization*
