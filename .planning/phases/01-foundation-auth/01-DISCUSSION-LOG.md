# Phase 1: Foundation & Auth - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-07
**Phase:** 1-Foundation & Auth
**Areas discussed:** Backend Framework, Database & ORM, Authentication Flow, Styling & UI

---

## Backend Framework

| Option | Description | Selected |
|--------|-------------|----------|
| Node.js + Express | Expose a clean REST + WebSocket API using JavaScript/TypeScript | ✓ |
| FastAPI (Python) | High-performance Python async framework | |

**User's choice:** Node.js + Express (as in the tech stack)
**Notes:** Proceeding with the Node.js/Express architecture specified in the tech stack.

---

## Database & ORM

| Option | Description | Selected |
|--------|-------------|----------|
| Prisma ORM | Clean schemas, automated migrations, type-safety | ✓ |
| Drizzle ORM | Lightweight, SQL-like syntax, excellent performance | |
| Raw pg-promise / pg queries | Maximum control over SQL query writing | |

**User's choice:** Prisma ORM
**Notes:** Using Prisma for type-safe and clean database access and automated migrations.

---

## Authentication Flow

| Option | Description | Selected |
|--------|-------------|----------|
| Constant code | Always use a code like 123456 | |
| Console logging | Backend logs generated OTP code to the terminal console | |
| On-screen mock toast | Displays the OTP as a UI notification toast on screen | ✓ |

**User's choice:** On-screen mock toast (displays the OTP as a UI notification on the screen)
**Notes:** Helps in quick and friendly interactive testing in the UI.

---

## Styling & UI

| Option | Description | Selected |
|--------|-------------|----------|
| Pure custom Tailwind CSS | Pure styling without component libraries | |
| Shadcn UI | Polish, tailwind-based components | ✓ |
| Radix UI primitives / Headless UI | Accessibility-focused primitives | |

**User's choice:** Shadcn UI (highly polished, tailwind-based, easily copy-pasted)
**Notes:** Provides a modern official government digital service style quickly.

---

## the agent's Discretion

- Backend controllers, routing structures, and middleware.
- Specific Express libraries for security/utilities (cors, helmet, dotenv).
- Toast notification library choice (e.g. Sonner).
- Exact design, placement, and visual styles of the OTP entry screen.

## Deferred Ideas

- Real SMS gateway integration (OTP) — deferred.
- Real DigiLocker / Aadhaar verification — deferred.

---

*Phase: 01-foundation-auth*
*Discussion log generated: 2026-07-07*
