# AllinDB

AllinDB is a PostgreSQL-first developer workspace for schema exploration, SQL work, AI assistance, and basic monitoring.

> **Project status:** Milestone 2 connection sessions are implemented and verified against the disposable PostgreSQL demo. Database exploration is next.

## Start here

1. Read [the product brief](docs/product/PRD.md).
2. Review [the architecture](docs/architecture/ARCHITECTURE.md), [AI architecture](docs/architecture/AI_ARCHITECTURE.md), and [security requirements](docs/SECURITY.md).
3. Follow the [roadmap](docs/plans/ROADMAP.md) and use the [milestone template](docs/plans/MILESTONE_TEMPLATE.md).
4. Use the workspace Copilot agents in `.github/agents/` and skills in `.github/skills/` for milestone planning, implementation, security review, and release readiness.

## Current proposed MVP

A local-first web app that connects to one PostgreSQL database, explores its schema, runs bounded read-only SQL, generates SQL for human review, and shows a small set of PostgreSQL health metrics.

The selected stack is React + TypeScript on the frontend and NestJS + TypeScript on the backend, with PostgreSQL as the first target database. Package versions and AI/retrieval libraries will be selected in their implementation milestones. Never expose arbitrary database connectivity publicly without the controls in [Security](docs/SECURITY.md).

## Local development

### Requirements

- Node.js 24 and npm 11 or newer.
- Podman 5 or newer and `podman-compose` (Podman's Compose provider).

### Start the demo database

The Compose file is OCI-compatible and is intended to be run with Podman. The checked-in `.env.example` contains known, disposable development credentials—not production secrets. Copy it to `.env` and customize the values if desired:

```sh
cp .env.example .env
podman compose up -d
```

The database binds only to `127.0.0.1:54329`. Connect using host `127.0.0.1`, port `54329`, database `allindb_demo`, and username `allindb_readonly`. The password is the `POSTGRES_READONLY_PASSWORD` value in `.env` (the checked-in example value works for the disposable demo). The form disables TLS for loopback hosts and automatically requires it for other hosts. These credentials must never be reused outside this disposable environment. PostgreSQL initialization scripts are copied into a local image to avoid host bind-mount permission issues and run only when the data volume is first created, so resetting an existing local volume is required to apply initialization changes.

To stop the database, run `podman compose down`. To remove the disposable database and its volume, run `podman compose down -v`.

### Install and run the app

```sh
npm install
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`), enter the demo connection details, test the connection, and choose **Connect**. The app keeps one database session in backend memory at a time; it does not save credentials in browser storage, and clears the password from the form after connecting. Choose **Disconnect** when finished. The backend also closes an active session when it shuts down.

The backend health endpoint is `http://localhost:3000/health`; the frontend proxies health and `/api` requests during development. The connection endpoints accept credentials only in the request body and return no credentials:

- `POST /api/connections/test` tests and closes a temporary connection.
- `POST /api/connections` opens the single active in-memory session.
- `DELETE /api/connections/:connectionId` closes that session.

Useful checks:

```sh
npm run lint
npm run build
npm test
npm run test:e2e
```

No external observability integration is configured. The app is for local development only; do not expose the API publicly or connect it to untrusted hosts from a hosted service.
