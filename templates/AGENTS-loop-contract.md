# Loop Operating Contract

Use a closed-loop workflow for multi-turn fixes, feature work, CI/test repair, PR review response, or any task that may need repeated attempts. Do not use an open-ended loop for vague goals.

Before starting a loop, define:

- Goal: one concrete outcome for the current task.
- Scope: modules, files, SQL, docs, tests, and commands the agent may touch.
- Done: objective stop conditions, such as focused tests passing, `git diff --check` passing, SQL validation passing, or an API response matching the expected schema.
- State: record any repeated attempt, high-risk change, failure retry, cross-agent task, or cross-session task in `progress.md`, including failures, changed files, verification evidence, blockers, and the next command.
- Feedback: feed the latest failure output, test logs, and risky diff findings into the next attempt instead of relying on chat memory.
- Guardrails: stop after repeated identical failures, unclear scope, missing credentials, unsafe data changes, or a human-gated operation.
- Verifier: behavior changes must be checked by tests, a QA/review agent, or a concrete manual regression checklist; the implementation agent must not be the only judge of completion.

Recommended loop limits:

- Focused implementation loop: 3-5 attempts.
- Multi-agent or cross-module loop: define phase checkpoints before dispatch.
- No-progress stop: stop and report when two consecutive attempts fail with the same root cause.
- Human approval gate: required before destructive git commands, production data changes, force pushes, irreversible database cleanup, or real provider calls that may spend money.
