# AllinDB product brief

**Status:** Approved MVP implementation baseline

## Product intent

AllinDB is a developer workspace that helps a developer understand and work with a PostgreSQL database from one interface. It combines database exploration, a SQL workspace, explainable AI assistance, and a small set of health metrics.

## Primary user

A software developer who works with PostgreSQL and wants to inspect unfamiliar schemas, run queries, and get help writing or understanding SQL without switching among several tools.

## Selected implementation stack

- Frontend: React + TypeScript + Vite.
- Backend: Node.js + NestJS + TypeScript.
- Local PostgreSQL: Podman Compose and a disposable synthetic demo database.
- Target database connectivity: `pg` (node-postgres), selected for later connection/explorer milestones.

## Core user journey

1. Start AllinDB locally and open the web interface.
2. Enter PostgreSQL connection details and test the connection.
3. Browse schemas, tables, columns, indexes, and foreign-key relationships.
4. Write and execute a bounded read-only query.
5. Ask the assistant to generate or explain SQL; inspect the result before deciding whether to run it.
6. View basic available database health information.

## MVP scope

- PostgreSQL only; one active target connection at a time.
- Local-first web experience.
- Connection test and transient connection session.
- Schema/table/column/index/foreign-key exploration.
- SQL editor, read-only execution, row/result limits, timeout and cancellation.
- AI SQL generation and explanation; assistant output is never auto-executed.
- Basic monitoring using PostgreSQL information visible to the configured role.
- Clear loading, empty, permission, error, and unavailable-metric states.

## Explicit non-goals for MVP

- Automatic query execution by AI.
- Write or DDL execution, migrations, or production-change workflows.
- Multi-user organizations, collaboration, role administration, or billing.
- MySQL, SQLite, or other target database engines.
- Autonomous tuning agents or automatic index/schema changes.
- Production-grade hosted access to arbitrary databases.
- Claims of a complete database observability platform.

## Product quality goals

- A beginner can connect to the included local demo database by following the setup guide.
- The user can distinguish generated SQL from executed SQL.
- Unsafe operations are rejected by backend policy and limited database privileges, not merely hidden in the UI.
- Failures explain what happened without disclosing secrets or raw internal stack traces.
- The app remains understandable and useful when permissions or monitoring settings are limited.

## MVP acceptance criteria

1. A clean local setup starts the frontend, API, and disposable PostgreSQL demo target from documented instructions.
2. A valid connection succeeds; invalid credentials, unreachable hosts, and insufficient permissions return safe actionable errors.
3. The explorer shows supported PostgreSQL metadata and handles empty/denied schemas.
4. Read-only SQL runs with server-enforced timeout and result limits; disallowed statements fail closed.
5. Query results and errors are rendered clearly; cancellation is supported if the selected driver path allows it.
6. AI can generate/explain SQL using relevant schema context without receiving connection secrets; output requires user review.
7. Monitoring displays supported metrics or clearly reports why they are unavailable.
8. Tests cover each acceptance criterion at the appropriate layer, and setup/security documentation matches the shipped behavior.
