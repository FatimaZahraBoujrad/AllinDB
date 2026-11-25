---
description: "Use when adding tests, changing test infrastructure, fixing regressions, or validating an AllinDB milestone."
applyTo: "**/tests/**, **/*test*.py, **/*spec*.ts, **/*spec*.tsx"
---
# Testing guidelines

- First inspect the repository's actual test commands and existing patterns; do not invent commands or dependencies.
- Add tests at the layer that owns the behavior: policy/unit tests, API integration tests, and UI interaction tests.
- Tests must not require a developer's personal database, credentials, or network access. Use disposable fixtures and the local test database.
- Include negative cases for permissions, malformed input, timeouts, cancellations, and limits where relevant.
- Run the narrow test first, then the related suite. Report command results accurately; distinguish not run from passed.
- Never use production data or destructive SQL in tests.
