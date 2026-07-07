---
phase: 1
slug: foundation-auth
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-07-07
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest + Supertest (backend), Vitest (frontend) |
| **Config file** | `backend/jest.config.js`, `frontend/vitest.config.ts` |
| **Quick run command** | `cd backend && npm test` |
| **Full suite command** | `cd backend && npm run test:full` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd backend && npm test`
- **After every plan wave:** Run `cd backend && npm run test:full`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | AUTH-01 | — | Backend and Frontend environments compile and spin up successfully. | integration | `npm run build` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | AUTH-03 | — | Database connection and Prisma schema migrations succeed. | integration | `npx prisma db push --force-reset` | ❌ W0 | ⬜ pending |
| 01-01-03 | 01 | 2 | AUTH-01 | — | Secure mock OTP endpoints successfully generate and verify codes. | API test | `npm test auth.test.ts` | ❌ W0 | ⬜ pending |
| 01-01-04 | 01 | 2 | AUTH-01 | — | Login screen is responsive, has OTP field, and triggers toast notification. | manual | N/A | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `backend/src/__tests__/auth.test.ts` — stubs for AUTH-01, AUTH-02
- [ ] `backend/jest.config.js` — Jest setup

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Login layout responsive & shows tricolor branding | ACC-02 | Requires visual design audit | Open `http://localhost:5173`, inspect design on mobile/desktop widths. |
| OTP display on screen toast | AUTH-01 | Verifies visual integration of on-screen toast | Enter a phone number, request OTP, verify toast pops up with 6-digit code. |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
