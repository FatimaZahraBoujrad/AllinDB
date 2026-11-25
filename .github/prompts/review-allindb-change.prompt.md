---
description: "Review an AllinDB change for correctness, security, test coverage, and alignment with the approved milestone."
name: "Review AllinDB change"
argument-hint: "Change, milestone, or files to review"
agent: "AllinDB Orchestrator"
---
Review the requested AllinDB change: ${input:scope:Diff, milestone, or files}

Inspect the current diff and relevant docs. Do not make edits. Delegate read-only security and test reviews when useful. Report only actionable findings, ordered by severity, with file/line references where available. Also report scope alignment, checks actually run, test gaps, and residual risks. If there are no findings, say so and state what was and was not reviewed.
