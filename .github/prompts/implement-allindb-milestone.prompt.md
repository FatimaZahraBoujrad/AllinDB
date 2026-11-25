---
description: "Implement an approved AllinDB milestone in small tested slices using the project workflow and specialist agents."
name: "Implement AllinDB milestone"
argument-hint: "Approved plan or milestone to implement"
agent: "AllinDB Orchestrator"
---
Implement this approved AllinDB milestone: ${input:milestone:Milestone or approved plan}

Before editing, inspect the current repository and confirm the acceptance criteria. Use `feature-delivery` and, for database work, `postgres-safety`. Create a short task list, delegate bounded non-overlapping work to the frontend/backend specialists when appropriate, and preserve a single owner for integration.

Implement only the agreed scope. Add or update tests, run existing relevant checks, request read-only security/test review when appropriate, and update docs only when they reflect verified behavior. If the plan conflicts with repository reality or a safety requirement, stop at that boundary, explain the conflict, and propose the smallest safe revision.

Final report: completed criteria, changed areas, exact checks and results, review findings, remaining risks, and any blocked work. Never claim unrun checks passed.
