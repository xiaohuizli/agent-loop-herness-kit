---
name: agent-loop-harness
description: Use when a project needs reusable Agent Loop rules, coding-agent harness setup, multi-agent coordination boundaries, verification gates, persistent task state, or closed-loop workflows for CI, PR review, feature work, debugging, SQL changes, or cross-session recovery.
---

# Agent Loop Harness

Use this skill to turn an AI-assisted project into a closed-loop system with explicit goals, persistent state, feedback, verification, and guardrails.

## Core Rule

Do not run open-ended agent loops for vague goals. Prefer closed loops with objective stop conditions.

Every loop must define:

| Field | Meaning |
|---|---|
| Goal | One concrete outcome |
| Scope | Files, modules, docs, SQL, tests, and commands allowed |
| Done | Objective stop condition |
| Requirement Gate | Whether PRD/spec confirmation is required before implementation |
| State | Where attempts, failures, blockers, and evidence are recorded |
| Feedback | What failure output enters the next attempt |
| Guardrails | Stop limits and human approval gates |
| Verifier | Test, QA agent, reviewer, or manual regression checklist |

## Startup Workflow

1. Inspect existing harness files: `AGENTS.md`, `CLAUDE.md`, `feature_list.json`, `progress.md`, `session-handoff.md`, `init.sh`, `.agent-team`.
2. Preserve project-specific rules and user changes.
3. Add only the smallest missing harness pieces.
4. Define the loop contract before implementation or agent dispatch.
5. Run focused verification before claiming completion.

## Requirement and Documentation Gates

For projects that require product or contract discipline, add an explicit PRD/spec confirmation gate to the root instruction file:

- New requirements, behavior changes, API contract changes, workflow changes, and cross-file fixes must complete PRD/spec confirmation before implementation.
- PRD and Spec confirmation should be staged: PRD first, then Spec, then implementation planning and code changes.
- Fast fixes that skip documentation require an explicit user approval after the skipped scope, risks, and verification method are stated.
- New Markdown deliverables should live under a categorized `docs/` folder, be indexed from `docs/index.md`, and use versioned filenames instead of overwriting earlier documents.
- Non-ASCII generated content, especially Chinese comments, SQL, prompts, and Markdown, must be written as UTF-8. In Windows/PowerShell paths, make UTF-8 explicit when writing files.

## Minimal Harness

For a project without a harness, create:

```text
AGENTS.md              # startup, scope, verification, done criteria
progress.md            # attempts, failures, evidence, next step
init.sh or commands    # verification entrypoint
```

For multi-session or multi-agent work, add:

```text
feature_list.json
session-handoff.md
.agent-team/start.md
.agent-team/team.yaml
```

## Loop Types

| Situation | Pattern |
|---|---|
| Small bug or feature | Single Agent Closed Loop |
| Risky behavior change | Generator-Verifier |
| Independent workstreams | Coordinator-Worker |
| Broad audit | Parallel Fan-Out with fixed output contract |
| CI or PR monitoring | Scheduled Closed Loop |

## Guardrails

- Focused implementation: stop after 3-5 attempts.
- No progress: stop after two attempts with the same root cause.
- Human approval: required for destructive git commands, production data edits, force push, irreversible cleanup, or paid provider calls.
- Loud failure: never silently invent placeholder data or mark incomplete work done.
- Context hygiene: store state outside chat; do not route every intermediate detail through the coordinator.

## Verification Gate

Behavior changes require at least one:

- focused automated test
- build/lint/type check
- SQL/schema validation
- QA agent review
- independent code review
- concrete manual regression checklist

Implementation agents do not self-approve.

## Common Mistakes

| Mistake | Fix |
|---|---|
| Starting without Done | Write stop conditions first |
| Treating chat as memory | Write state to files, issue, PR, or board |
| Repeating the same failed attempt | Stop and report blocker |
| Multi-agent editing same hotspot | Assign non-overlapping ownership |
| Coordinator doing domain reasoning | Coordinator routes and merges only |
| Agent verifies its own work | Add test, QA agent, reviewer, or checklist |

## Completion Report

After applying this skill, make the smallest necessary file changes first. In the final response, report:

```text
Goal:
Scope:
Requirement gate:
Done:
State files:
Loop type:
Guardrails:
Verifier:
Implementation steps:
Verification commands:
Risks:
Next command:
```
