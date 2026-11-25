# AllinDB AI architecture

**Status:** Direction for MVP and future RAG/agent work. AI provider and orchestration libraries are not selected yet.

## Compatibility decision

NestJS does not block AI features. The MVP's model calls, structured output validation, schema-context preparation, retrieval APIs, and later agent orchestration can run in TypeScript services. Keep provider-specific SDKs behind interfaces so the product is not coupled to one model vendor or orchestration library.

A Python service remains an option only if a concrete need depends on Python-only ML libraries or local model infrastructure. It is not required for ordinary LLM API calls, retrieval over database metadata/docs, or bounded tool orchestration.

## MVP flow: generate and explain SQL

```text
User request
  -> NestJS Assistant module
  -> Context builder (minimum relevant schema metadata)
  -> Model provider adapter
  -> Structured suggestion/explanation
  -> UI displays inert output for user review
```

The assistant receives no connection password or unrestricted database capability. It returns SQL as text. If the user chooses to run it, the request goes through the normal SQL policy and bounded read-only execution path. The model never bypasses that path.

## Future RAG flow

1. Define approved sources, such as product documentation and visible schema metadata.
2. Normalize, chunk, and tag content with source, owner/tenant, database/session scope, and freshness metadata.
3. Generate embeddings through a provider interface.
4. Store vectors using PostgreSQL with `pgvector` or a separately selected vector service after evaluating scale, isolation, deletion, and operations.
5. Retrieve only content authorized for the current user/session and pass a minimized set of chunks to the model.
6. Return citations/source references and handle stale or missing context explicitly.

RAG is retrieval and context management; it does not inherently require a Python backend. Vector storage and embedding generation are separate choices from NestJS.

## Future agent boundary

Agent orchestration can be added as a dedicated NestJS module, separated from provider integration and retrieval. Give agents narrowly scoped tools such as searching approved documentation or reading already-authorized schema metadata. Every tool must validate input, enforce connection/session scope, apply timeouts and limits, and emit appropriate audit events.

Do not provide arbitrary shell, filesystem, network, or unrestricted SQL tools. Any proposed SQL remains subject to explicit user review and the same server-side read-only policy. Write/DDL actions require a separate product decision and threat model.

## Suggested module boundaries (future, not scaffolded)

- `AiModule`: feature-facing API and request validation.
- `ModelProvider` interface: provider-specific request/response adapter.
- `ContextBuilder`: minimal schema/docs context assembly.
- `RetrievalModule`: source ingestion, embeddings, authorization-aware retrieval, and citations when RAG is approved.
- `AgentOrchestratorModule`: controlled planning/tool loop when agents are approved.
- Existing connection and SQL execution services remain the sole database access boundary.

Do not add all these modules or dependencies to the MVP before their roadmap milestone. Start with one provider adapter and a small context builder; keep the provider contract replaceable.

## Security and quality requirements

- Never send credentials, tokens, or connection URLs to a model.
- Treat schema comments, identifiers, SQL, docs, and result values as untrusted content, not system instructions.
- Minimize and disclose externally transmitted data.
- Validate model output against a schema; do not assume generated SQL is valid or safe.
- Keep retrieval tenant/session scoped; test authorization leakage, prompt injection, stale content, and provider failures.
- Track model/provider, prompt version, and retrieval sources where useful, without logging sensitive prompt payloads by default.
- Measure quality with a small reviewed evaluation set before making AI behavior a release requirement.
