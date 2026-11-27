# AllinDB implementation roadmap

**Status:** Milestones 1 and 2 complete; database exploration is next.

## Milestone 0 — Product and engineering baseline

- [x] Confirm the MVP and non-goals in `docs/product/PRD.md`.
- [x] Select local-first deployment and NestJS/TypeScript stack in `docs/architecture/ARCHITECTURE.md`.
- [x] Review the security requirements in `docs/SECURITY.md`.
- [x] Select npm workspaces, Node.js 24, and local Podman Compose for the initial scaffold.

**Exit gate:** satisfied for initial foundation; future database/AI work must still follow the security doc.

## Milestone 1 — Repository foundation

- [x] Create frontend and backend app skeletons.
- [x] Add Podman Compose with a synthetic demo PostgreSQL database.
- [x] Add environment examples, health checks, format/lint/type/test commands, and CI baseline.
- [x] Document clean setup and teardown.

**Exit gate:** frontend/API startup, code checks, Compose configuration, and disposable PostgreSQL initialization verified. Podman reported a rootless network cleanup permission error on shutdown; check local container state if cleanup did not complete. No production telemetry is enabled by default.

**Evidence:** `npm run check` passed (lint, frontend/backend build, and unit tests: 2 passed); `npm run test:e2e` passed (1 test); `npm audit --omit=dev` reported 0 vulnerabilities; `podman compose --env-file .env.example config` rendered successfully. Podman pulled the PostgreSQL 17 image, built the local init image, initialized the database and sample rows; the restricted role read all 3 sample rows and was denied temporary-table creation. `podman compose down` then reported a rootless network cleanup permission error, so container cleanup status should be checked locally.

## Milestone 2 — PostgreSQL connection session

- [x] Build connection form and connection test.
- [x] Implement backend connection lifecycle and safe error translation.
- [x] Use the demo's least-privilege read-only role.
- [x] Ensure secrets are not persisted or logged.

**Exit gate:** met. Valid and invalid connections are handled safely against the disposable PostgreSQL target; tests cover failures and secret redaction.

**Evidence:** connection UI and `/api/connections` test/start/stop routes are implemented. Unit and API tests use fake PostgreSQL clients to cover lifecycle, input validation, error translation, TLS enforcement, and secret redaction. Manual live checks against the disposable PostgreSQL 17 demo verified the read-only role, successful test and session lifecycle, safe invalid-password handling, unreachable-host errors, and remote TLS enforcement. `npm run check`, `npm run test:e2e`, and `npm audit` pass with 0 vulnerabilities. Docker Compose was used because Podman is unavailable in the current environment; the disposable container and network were stopped after verification, and its volume was preserved.

## Milestone 3 — Database explorer

- [ ] Discover visible schemas, tables, columns, indexes, and foreign keys.
- [ ] Implement typed API contracts and explorer navigation.
- [ ] Handle empty schemas, partial permissions, loading, and failures.

**Exit gate:** the demo schema is browsable and backend integration tests cover supported metadata.

## Milestone 4 — Read-only SQL workspace

- [ ] Add SQL editor and query lifecycle states.
- [ ] Add server-side SQL policy, read-only transaction/role, timeout, row/result limits, and cancellation.
- [ ] Render bounded result sets and safe errors.
- [ ] Add tests that prove writes and DDL are denied.

**Exit gate:** accepted read queries work; forbidden operations fail closed; limits and timeouts are verified.

## Milestone 5 — AI SQL assistant

- [ ] Add provider adapter and server-side configuration.
- [ ] Generate and explain SQL using minimized schema context.
- [ ] Label generated output and require user review before execution.
- [ ] Test provider failures, prompt/data boundaries, and missing configuration.

**Exit gate:** AI suggestions are useful, secrets are excluded, and no assistant path executes queries automatically.

## Milestone 6 — Basic monitoring

- [ ] Select a small, permission-compatible set of PostgreSQL metrics.
- [ ] Add monitoring API and dashboard states.
- [ ] Handle unavailable statistics without requesting elevated privileges.

**Exit gate:** supported metrics and permission-based unavailable states are tested and documented.

## Milestone 7 — MVP hardening

- [ ] Add end-to-end happy path and critical negative-path coverage.
- [ ] Review dependency/configuration hygiene, logging, privacy, accessibility, and recovery behavior.
- [ ] Complete `release-readiness` review; document limitations and known issues.

**Exit gate:** PRD acceptance criteria are met; all applicable checks pass; remaining risks are explicit.

## Milestone 8 — Distribution decision

Evaluate local developer tool, hosted service, or desktop packaging. Hosted deployment is blocked until authentication, tenant isolation, encrypted secret management, network egress protections, quotas, and operational response are designed and reviewed.

**Exit gate:** chosen distribution has a deployment-specific threat model, setup guide, and support boundary.

## Post-MVP — Retrieval and controlled AI agents

- [ ] Add retrieval over approved documentation and schema metadata, with source references and freshness rules.
- [ ] Evaluate PostgreSQL `pgvector` or a managed vector store only after defining corpus size, isolation, deletion, and indexing requirements.
- [ ] Add agent orchestration as a separate NestJS module with narrowly scoped tools and explicit policy checks.
- [ ] Keep SQL execution behind the same read-only authorization, timeout, limit, and user-confirmation path; agents do not receive unrestricted database credentials or arbitrary execution tools.
- [ ] Consider a Python service only if a concrete ML/embedding/reranking capability cannot be served reasonably by the TypeScript provider ecosystem.

**Exit gate:** retrieval is permission-scoped and traceable; every agent action is bounded, observable, and covered by security tests.

## Working rule

Use `docs/plans/MILESTONE_TEMPLATE.md` for each milestone. Do not check an item complete based only on code presence; require tests or other observable evidence. Update this roadmap after verification, not before.
