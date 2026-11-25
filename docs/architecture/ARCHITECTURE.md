# AllinDB architecture

**Status:** Accepted MVP direction; package versions and implementation details are finalized during scaffolding.

## System boundary

```text
Browser UI (React + TypeScript)
        │ JSON over local HTTP / HTTPS in deployment
        ▼
NestJS application (TypeScript)
  ├── Connection/session service
  ├── PostgreSQL metadata service
  ├── SQL policy and execution service
  ├── AI provider adapter
  └── Monitoring service
        │
        └── User-selected PostgreSQL target
```

The target PostgreSQL database is distinct from any future AllinDB control-plane database. The MVP should avoid an application metadata database unless a concrete feature requires durable state. Do not mix AllinDB's own persistence with target database access.

## Selected MVP technology choices

- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Monaco Editor.
- Backend: Node.js, NestJS, TypeScript, DTO validation, and modular providers/services.
- PostgreSQL target connectivity: `pg` (node-postgres) with direct parameterized catalog queries. Do not map arbitrary user schemas through an ORM. A separate ORM can be considered only if AllinDB later needs its own persistent control-plane data.
- SQL parsing/inspection: select a PostgreSQL-compatible TypeScript parser during the SQL workspace milestone and test its dialect coverage. Parsing is defense-in-depth and developer feedback, never the security boundary.
- Local environment: Podman Compose with a disposable demo PostgreSQL target; keep the Compose file OCI-compatible.
- AI: server-side NestJS module with a provider adapter; begin with one provider and keep prompts/data handling behind interfaces.

See [AI architecture](AI_ARCHITECTURE.md) for the RAG and controlled-agent extension path.

This stack is selected, but no application dependencies exist yet. Confirm supported Node.js/package versions during scaffold and pin them in project configuration.

## Responsibilities

### Frontend

- Connection setup and status.
- Explorer navigation and schema display.
- SQL editor, execution status, result display, and cancellation affordance.
- AI generation/explanation display with explicit review-before-run behavior.
- Monitoring cards and graceful unavailable states.

### Backend

- Validate and normalize requests with NestJS DTO/pipes.
- Create and dispose target database connections safely.
- Enforce SQL policy, database role expectations, timeouts, result caps, and cancellation.
- Return typed API responses and safe errors.
- Send only minimized schema/query context to the AI provider; never connection credentials.

### Target database

- Use a dedicated least-privilege role, read-only for MVP.
- Treat catalog visibility and monitoring permissions as variable by role.
- The local demo database is disposable and must contain synthetic data only.

## Initial connection lifecycle

For the MVP, connection secrets should be transient and not persisted in browser storage or a product database. The backend should minimize secret lifetime and avoid logging connection URLs. The user explicitly starts and ends a connection session. Persistent encrypted connection profiles are a later feature requiring a separate threat model.

## SQL execution path

1. Receive query and connection session identifier.
2. Validate request size and session ownership.
3. Parse/inspect the complete statement structure where practical.
4. Reject unsupported or disallowed operation types.
5. Execute with a read-only database role/transaction, server timeout, and bounded result retrieval.
6. Cancel/close resources on timeout, client cancellation, or session end.
7. Return bounded results and safe error details.

Database permissions and transaction mode are primary protection. SQL parsing is supplementary.

## API shape

Proposed resource areas: `/health`, `/api/connections`, `/api/schemas`, `/api/tables`, `/api/query`, `/api/assistant`, and `/api/monitoring`. Final paths and response types should be documented before parallel UI/API implementation. Use NestJS DTOs as the API contract and generate or mirror frontend types in a controlled way.

## Deployment boundary

The first supported deployment is local development. A hosted deployment that accepts user-supplied database hosts introduces server-side network access risk. Before hosting, require authentication, tenant isolation, encrypted secret management, network egress controls, private/internal IP protections, quotas, audit policy, and operational incident procedures. Do not expose a raw arbitrary-host connection endpoint publicly.
