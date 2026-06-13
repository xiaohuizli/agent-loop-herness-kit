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
