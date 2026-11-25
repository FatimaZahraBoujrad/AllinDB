---
name: release-readiness
description: 'Use when preparing an AllinDB milestone, preview, or product release; verify tests, security, documentation, configuration, and known limitations.'
user-invocable: true
---
# AllinDB release readiness

## Procedure
1. Confirm the release scope and acceptance criteria in `docs/plans/ROADMAP.md`.
2. Inspect the complete diff and working tree; verify no secrets, local database files, generated artifacts, or unrelated changes are included.
3. Run the repository's documented formatting, lint, type-check, unit, integration, and build checks that apply. Do not report unrun checks as passing.
4. Review database access, SQL execution policy, credential handling, AI data flow, logging, and deployment network exposure against `docs/SECURITY.md`.
5. Verify `.env.example`, setup instructions, migrations, demo data, and rollback/recovery notes where applicable.
6. Check empty, error, permission-denied, timeout, and cancellation states in changed user flows.
7. Document known issues and deployment prerequisites. Do not call a milestone complete if an acceptance criterion is unmet; identify the blocker and next action.

## Output
Return a concise readiness report: scope, checks and results, security findings, open blockers, and go/no-go recommendation.
