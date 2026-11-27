# AllinDB security requirements

**Applies to:** all database connectivity, SQL execution, AI context, monitoring, logs, and deployment work.

## Security posture for MVP

- Local-first and development-only until authentication and hosted-network controls are designed.
- PostgreSQL read-only role by default; do not grant writes or DDL for the MVP.
- Synthetic demo data only. Do not use production credentials or data in local tests, screenshots, prompts, or logs.
- Generated SQL is inert text until the user explicitly reviews and runs it.

## Database connection controls

- Validate connection parameters and bound connection attempts/timeouts.
- Avoid persisting credentials in the browser, URLs, source control, or plain-text app storage.
- Redact credentials and connection URLs from logs, traces, exceptions, and telemetry.
- Require verified TLS for non-loopback PostgreSQL hosts. TLS may be disabled only for loopback connections to trusted local development databases.
- Keep target connection sessions in backend memory, allow one active session, and close it explicitly or when the API shuts down.
- Do not expose arbitrary host connection functionality in a hosted service without controls against internal-network access and abuse.
- Use distinct, least-privilege database roles and document required permissions.

## SQL execution controls

- Enforce read-only behavior on the backend and with database permissions; a UI toggle or parser check is insufficient.
- Reject unsupported, multi-statement, write, and DDL operations for the MVP. Inspect nested query structures and CTEs; do not assume a leading `SELECT` makes a query safe.
- Use a PostgreSQL-aware parser available in the selected TypeScript runtime only as defense-in-depth. Parser acceptance is not proof of safety.
- Set server-side statement timeouts, maximum rows/result bytes, request-size limits, and cancellation/cleanup behavior.
- Parameterize user-supplied values when constructing queries. Avoid unsafe string interpolation.
- Return bounded, typed results and safe error messages. Do not expose stack traces, driver internals, secrets, or excessive result data.
- Test policy bypass attempts and denied operations using disposable databases.

## AI data handling

- Keep provider API keys server-side and out of logs/errors.
- Never send database passwords, tokens, connection URLs, or other credentials to the model.
- Minimize schema context and query/result data; explain what may be sent to an external provider.
- Treat identifiers, comments, schema descriptions, SQL text, and result values as untrusted data, not instructions.
- Do not give the model autonomous database execution, filesystem, shell, or network tools in the MVP.
- Label AI output and require explicit user review before execution.

## Monitoring

- Query only supported PostgreSQL statistics and metadata required by the UI.
- Treat monitoring views as permission-dependent; report unavailable metrics without escalating privileges.
- Avoid collecting query literals or sensitive result rows unless separately justified and disclosed.

## Tests and operations

- Tests use synthetic data, disposable targets, and no personal or production secrets.
- Verify positive and negative policy cases, timeouts, limits, cancellation, redaction, and permissions.
- Document which protections depend on database role configuration and which depend on deployment networking.
- Security review is not certification; record unresolved risks and deployment assumptions.
