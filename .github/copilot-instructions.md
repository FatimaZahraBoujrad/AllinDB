# AllinDB project instructions

AllinDB is a PostgreSQL-first developer workspace for schema exploration, SQL work, AI assistance, and basic monitoring. The first release is a local-first web app; keep the MVP narrow and do not introduce multi-tenancy, extra database engines, autonomous agents, or write-capable AI without an explicit plan.

## Working rules
- Read `docs/product/PRD.md`, `docs/architecture/ARCHITECTURE.md`, and `docs/plans/ROADMAP.md` before changing product boundaries or architecture.
- Follow `docs/SECURITY.md` for every database connection, SQL execution, credential, AI, and monitoring change.
- Make small, reviewable changes. Write or update tests with behavior changes, run the relevant checks, and report exact results and any checks not run.
- Do not claim code, tests, or runtime behavior that you have not verified. Do not silently broaden scope.
- Keep user SQL and database-provided text untrusted. Never expose credentials in logs, errors, prompts, or test output.
- Prefer explicit types and validated API schemas. Keep frontend and backend contracts aligned.
- Record significant architectural decisions as numbered ADRs under `docs/adr/`.

## Current stage
The selected application stack is React + TypeScript with a NestJS + TypeScript backend and PostgreSQL target connectivity. The workspace is still project-planning only. Before adding application code, implement the first approved milestone from `docs/plans/ROADMAP.md` and establish the actual package/tool commands in the README and CI.
