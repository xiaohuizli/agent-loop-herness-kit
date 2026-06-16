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

## Change Definition Gate

For new requirements, behavior changes, API contract changes, workflow changes, or cross-file fixes, complete a PRD/spec confirmation flow before implementation.

- Generate and confirm the PRD first. Do not generate a Spec, implementation plan, tests, or business-file changes before the user explicitly confirms the PRD.
- After PRD confirmation, generate and confirm the Spec. Do not begin implementation, test writing, or business-file changes before the user explicitly confirms the Spec.
- PRD/spec confirmation items may be resolved in conversation first; write confirmed decisions into the document once the user has explicitly answered them.
- Store new PRD/spec Markdown files under a categorized folder in `docs/`, then update `docs/index.md`.
- If a document for the same topic already exists, create the next versioned file instead of overwriting the old one, such as `topic_v2.md` after `topic_v1.md`.
- PRD/spec documents should include background and goals, scope and non-scope, API/data contracts, processing flow, exception and compatibility strategy, test and acceptance criteria, and confirmation records or open questions.
- If the user asks to skip documentation or make a quick fix, state the skipped scope, risk, and verification method, then continue only after explicit user approval.

## Documentation and Encoding

- New comments, API documentation annotations, Markdown deliverables, and user-facing project documentation should use the project's primary documentation language.
- Preserve code identifiers, command names, protocol fields, and necessary third-party technical terms in their original language when clearer.
- Write generated or updated non-ASCII text as UTF-8.
- In Windows/PowerShell flows, explicitly use UTF-8 when writing SQL, prompts, Markdown, or other non-ASCII content.
