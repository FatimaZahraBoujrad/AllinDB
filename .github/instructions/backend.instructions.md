---
description: "Use when creating or changing AllinDB Node.js, NestJS, TypeScript backend, PostgreSQL access, API schemas, AI services, or backend tests."
applyTo: "backend/**"
---
# NestJS backend guidelines

- Keep HTTP routing, validation schemas, and service logic separated; routers should remain thin.
- Use typed NestJS DTOs/pipes for request validation and asynchronous database APIs consistently.
- Keep NestJS modules, controllers, providers, and services focused; controllers should remain thin.
- Acquire target-database connections through the connection service; do not construct ad hoc connections inside route handlers.
- Use `pg` for dynamic user-selected PostgreSQL targets; do not map arbitrary target schemas through an ORM.
- Apply per-request timeouts, cancellation, and result limits to user SQL. Enforce safety on the server and database role, not only in the UI.
- Translate expected database failures into safe, actionable API errors. Do not return connection strings, credentials, stack traces, or raw driver internals.
- Add unit tests for policy and integration tests for PostgreSQL behavior. Use isolated test databases and deterministic cleanup.
- Keep configuration in validated settings; never hardcode secrets or environment-specific URLs.
