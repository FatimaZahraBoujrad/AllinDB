---
description: "Turn an AllinDB roadmap milestone or feature idea into a scoped, testable implementation plan."
name: "Plan AllinDB milestone"
argument-hint: "Milestone or feature to plan"
agent: "AllinDB Orchestrator"
---
Plan the requested AllinDB work: ${input:milestone:Milestone or feature}

Read the current product, architecture, security, and roadmap documents plus relevant source. Do not implement yet. Return:
1. User outcome and explicit non-goals.
2. Acceptance criteria that can be verified.
3. Current-state findings and assumptions.
4. Ordered implementation slices with likely files/components.
5. API/data-contract changes.
6. Security and failure-mode considerations.
7. Tests and commands to run, based only on commands that exist (label proposed commands clearly).
8. Documentation and roadmap updates needed.
9. Blockers requiring a user decision.
