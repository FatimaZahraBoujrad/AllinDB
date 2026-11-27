# AllinDB backend

The NestJS API is started from the repository root with `npm run dev:api`. It binds to `127.0.0.1` by default.

## Connection API

- `POST /api/connections/test` tests and closes a temporary PostgreSQL connection.
- `POST /api/connections` creates the one active in-memory connection session.
- `DELETE /api/connections/:connectionId` explicitly closes that session.

Connection credentials are accepted only in the request body, are not logged or persisted, and are not included in responses. TLS is required for non-loopback hosts; disabling TLS is limited to loopback database addresses. This API is for local development only and must not be exposed publicly.

## Checks

Run backend unit and API tests from the repository root with `npm test` and `npm run test:e2e`.
