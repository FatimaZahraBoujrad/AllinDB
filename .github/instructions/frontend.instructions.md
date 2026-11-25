---
description: "Use when building or changing AllinDB React, TypeScript, styling, forms, editor, explorer, or monitoring UI."
applyTo: "frontend/**"
---
# Frontend guidelines

- Use TypeScript types that match the backend API contracts; avoid `any` and duplicated undocumented response shapes.
- Keep feature-specific UI, data fetching, and types together under the relevant feature directory.
- Represent loading, empty, success, and error states explicitly. Do not hide permission errors or silently discard query results.
- Keep connection secrets out of browser storage, URLs, telemetry, and client-side logs.
- For SQL actions, show the query and its execution mode clearly; never imply that generated SQL ran when it did not.
- Build accessible controls, keyboard-operable dialogs, and responsive layouts. Reuse shared components rather than introducing competing visual patterns.
- Add focused component tests for meaningful user behavior and API failure states.
