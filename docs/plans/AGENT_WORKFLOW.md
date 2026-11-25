# AllinDB agent workflow

This workflow coordinates Copilot custom agents, skills, prompts, and human decisions. It is designed to keep implementation evidence-based and changes reviewable, not to maximize autonomous activity.

## Roles

| Role | Responsibility | May edit? |
|---|---|---:|
| AllinDB Orchestrator | Scope, plan, delegation, integration, final verification | Yes |
| AllinDB Backend | NestJS/TypeScript, PostgreSQL service, API and backend tests | Yes, assigned backend scope |
| AllinDB Frontend | React UI, API client/types, frontend tests | Yes, assigned frontend scope |
| AllinDB Security Reviewer | Read-only trust-boundary and safety review | No |
| AllinDB Test Reviewer | Read-only coverage and verification review | No |

## Standard feature loop

1. **Orient:** inspect repository state, instructions, product brief, architecture, security requirements, and roadmap.
2. **Plan:** state user outcome, non-goals, acceptance criteria, impacted layers, API contract, risks, and tests. Use the `Plan AllinDB milestone` prompt for planning-only requests.
3. **Decision gate:** obtain user confirmation when scope, security posture, data persistence, write access, or a new dependency materially changes the approved baseline. Do not silently decide high-impact product questions.
4. **Decompose:** create small vertical slices. Delegate only tasks with stable boundaries. Define shared API contracts before parallel implementation; avoid overlapping edits.
5. **Implement:** the orchestrator remains accountable for integration. Specialists return changed files, assumptions, tests, and blockers. Use `feature-delivery`; use `postgres-safety` for any database-facing change.
6. **Verify:** run actual repository checks, inspect output, and request a read-only test and security review where warranted. Fix findings or report why they remain.
7. **Close:** inspect the complete diff, update docs/roadmap only with evidence, and report exact verification results and unresolved risks.

## Delegation rules

- Delegate research freely when it avoids conflicting edits.
- Backend and frontend may work in parallel only after API shape and file ownership are clear.
- Reviewer agents are read-only and must identify concrete evidence and locations.
- The orchestrator must not treat a subagent summary as proof that a command passed; verify relevant results and inspect integration.
- If a specialist identifies an unsafe or scope-changing dependency, pause and present the decision to the user.

## Safety gates

- No production credentials/data in development or tests.
- No write/DDL SQL execution in MVP.
- No AI auto-execution or secrets in model context.
- No hosted arbitrary-host database access before a deployment threat model and network controls.
- No milestone completion without passing acceptance evidence and truthful reporting.

## Useful entry points

- `/plan-milestone` — produce an implementation plan without code changes.
- `/implement-allindb-milestone` — implement an approved plan.
- `/review-allindb-change` — review a change without edits.
- `feature-delivery` skill — end-to-end feature procedure.
- `postgres-safety` skill — database-specific safety procedure.
- `release-readiness` skill — pre-release checklist.
