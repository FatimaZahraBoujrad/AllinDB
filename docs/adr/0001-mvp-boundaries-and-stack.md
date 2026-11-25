# ADR 0001: MVP boundaries and NestJS stack

- **Status:** Accepted
- **Date:** 2026-11-25
- **Decision owners:** Project owner

## Context

AllinDB is starting from an empty workspace. The initial goal is to deliver a real, testable PostgreSQL developer tool without expanding into multi-database support, hosted multi-tenancy, autonomous database changes, or a full observability platform.

## Decision

Build a local-first browser application with a React + TypeScript frontend and a NestJS + TypeScript backend on Node.js. Target PostgreSQL only. Use `pg` (node-postgres) for direct target-database connections and catalog inspection; do not use an ORM to model arbitrary user schemas. Select a PostgreSQL-compatible TypeScript SQL parser during the SQL workspace milestone, with tests for dialect coverage. Use Podman Compose for a disposable demo database. Keep an AllinDB control-plane database out of the MVP unless a concrete feature requires durable application state.

The MVP connection role is read-only. SQL generation and explanation are assistive only; AI output is reviewed by the user and never executed automatically. Monitoring is limited to metrics available under documented permissions.

## Consequences

- A single monorepo and local Compose workflow keep early development testable.
- TypeScript across frontend and backend allows shared API contract tooling and one primary language.
- NestJS modules and provider interfaces can host LLM calls, retrieval, and agent orchestration; this does not require a Python backend.
- A TypeScript SQL parser can improve validation and feedback but cannot serve as the security boundary.
- Python-only ML or embedding libraries can be integrated behind a separate service later if a concrete need justifies operating a second runtime.
- Local-first reduces early deployment complexity, but does not make arbitrary database access inherently safe.
- Hosted deployment and persistent connection profiles require separate security decisions.

## Revisit when

- The product owner chooses a different first distribution model.
- A required feature needs persistent users, teams, or connection profiles.
- Additional database engines are proposed.
- A safe write/DDL workflow is requested.

## Approval

The framework and language choice is approved. Package versions, test tooling, and any future persistence/AI orchestration libraries remain to be selected during the relevant milestone.
