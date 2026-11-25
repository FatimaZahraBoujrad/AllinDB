---
name: feature-delivery
description: 'Use when planning or implementing an AllinDB feature or roadmap milestone, from acceptance criteria through code, tests, review, and documentation.'
user-invocable: true
argument-hint: 'Describe the feature or milestone to deliver'
---
# AllinDB feature delivery

## Procedure
1. Read the product requirements, architecture, roadmap, security requirements, and relevant code before proposing changes.
2. Clarify the user outcome and write testable acceptance criteria. Separate must-have behavior from deferred scope.
3. Inspect current repository conventions and available commands. For cross-layer work, define the API contract before parallel frontend/backend changes.
4. Make a short implementation plan with impacted files, data-flow changes, security risks, tests, and documentation updates. Track multi-step work in the task list.
5. Implement in small vertical slices. Delegate only bounded, non-conflicting investigations or implementation tasks; one agent owns integration and final verification.
6. Add tests for normal, failure, permission, and boundary cases. Follow `postgres-safety` for all database-related behavior.
7. Run relevant lint/type/test/build checks that exist. If no checks exist yet, state that and add the smallest appropriate baseline instead of claiming validation.
8. Review the diff for scope creep, secrets, unsafe SQL, stale docs, and incomplete error states.
9. Update the roadmap only when a milestone's acceptance criteria are actually met. Summarize changed behavior, tests, and unresolved risks.

## Definition of done
A feature is done only when acceptance criteria are satisfied, relevant tests pass, security implications are reviewed, docs/contracts are current, and verification limits are disclosed.
