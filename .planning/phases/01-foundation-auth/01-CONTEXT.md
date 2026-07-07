# Phase 1: Foundation & Auth - Context

**Gathered:** 2026-07-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Set up the basic full-stack boilerplate (React 18 + Vite frontend, Express + Node.js backend, PostgreSQL database connection) and a mock OTP verification flow.

</domain>

<decisions>
## Implementation Decisions

### Backend Framework
- **D-01:** Node.js + Express backend API.
- **D-02:** Use REST endpoints for communication between frontend and backend.

### Database & Access
- **D-03:** PostgreSQL as the database.
- **D-04:** Use Prisma ORM for schema definitions, migrations, and query building.

### Authentication Flow
- **D-05:** Mock OTP-based phone login for citizens.
- **D-06:** The mock OTP code must be displayed via an on-screen mock toast notification in the UI for ease of login testing.

### Styling & UI
- **D-07:** Tailwind CSS custom theme containing tricolor-inspired branding (Navy, Saffron, Green, White).
- **D-08:** Use Shadcn UI for clean and polished components.

### the agent's Discretion
- Backend structure (controllers, routing, middleware).
- Specific Express libraries for security/utilities (e.g., cors, helmet, dotenv).
- Toast notification library choice (e.g., Sonner).
- Exact design, placement, and visual styles of the OTP entry screen.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope & Goals
- `.planning/PROJECT.md` — Vision, tricolor constraints, and requirements.
- `.planning/REQUIREMENTS.md` — Core authentication specifications (AUTH-01, AUTH-02, AUTH-03).
- `.planning/ROADMAP.md` — Success criteria for Phase 1.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None (Greenfield codebase starting from scratch).

</code_context>

<deferred>
## Deferred Ideas

- Real SMS gateway integration (OTP) — deferred (mocked in v1).
- Real DigiLocker / Aadhaar verification — deferred.

</deferred>

---

*Phase: 01-foundation-auth*
*Context gathered: 2026-07-07*
