# Multi-Agent Team Startup Guide

This guide explains how to start and operate a generic `.agent-team` setup.

## 1. Team Files

- Team configuration: `.agent-team/team.yaml`
- Agent prompts: `.agent-team/prompts/*.md`
- Startup guide: `.agent-team/start.md`

Do not add project-private connection helpers, credential readers, or environment-specific scripts to this generic template. Keep those in the target repository only when the project owner explicitly approves them.

## 2. Startup Command Pattern

Act as the coordinator agent for this repository.

Read:

- `.agent-team/team.yaml`
- `.agent-team/prompts/coordinator.md`

First perform a fresh project-state scan:

- `git status --short`
- `rg --files`
- targeted search in docs, code, tests, SQL, and config files relevant to the request
- read the latest relevant files before assigning agents

User request:

```text
<paste the requirement here>
```

Return:

1. affected domains
2. selected agents
3. non-overlapping file ownership
4. implementation order
5. verification plan
6. risks and approval gates

## 3. Dispatch Pattern

After the coordinator selects agents, dispatch only independent scopes in parallel.

Good parallel examples:

- `docs`: inspect documentation impact only
- `provider`: inspect adapter or strategy impact only
- `billing`: inspect quota or charge impact only
- `asset`: inspect resource lifecycle impact only
- `qa`: design focused verification

Bad parallel example:

- two implementation agents editing the same hotspot file or shared state at the same time

The coordinator must serialize hotspot edits or assign one active owner.

## 4. Agent Task Template

Use this template for each selected agent:

```text
Act as the <agent_id> agent for this repository.

Read:
- .agent-team/team.yaml
- .agent-team/prompts/<agent_id>.md
- relevant docs, code, and tests inside your assigned scope

Task:
<specific task>

Ownership:
<files or directories this agent may edit>

Constraints:
- Do not edit files outside ownership without coordinator approval.
- Do not revert unrelated changes.
- Do not call real paid or destructive services without explicit approval.
- Return changed files, reasoning, risks, and verification.

Expected output:
1. summary
2. files changed or files to change
3. behavior impact
4. tests or regression checks
5. open questions
```

## 5. Recommended Workflows

### Feature touching the main workflow

1. `coordinator` classifies the request.
2. Supporting agents analyze independent domains in parallel if needed.
3. `domain_core` integrates the agreed behavior into the main workflow.
4. `qa` runs focused checks or produces a regression report.
5. `coordinator` summarizes final behavior and risks.

### Feature touching one provider only

1. `coordinator` selects `provider`.
2. `provider` changes strategy, adapter, client, or mapping behavior.
3. `billing` joins only if price, quota, or usage semantics change.
4. `qa` verifies provider-specific checks.

### Feature touching admin configuration

1. `coordinator` selects `admin_config`.
2. Domain agents join only when runtime semantics are affected.
3. `qa` verifies controller, service, job, or configuration behavior.

### Feature touching documentation

1. `coordinator` selects `docs`.
2. `docs` checks existing documents before creating new ones.
3. `docs` verifies claims against code, tests, schemas, or user-confirmed behavior.
4. Domain agents join only when documentation reveals code or behavior gaps.
5. `qa` joins when documentation describes tests, failure reports, or regression steps.

## 6. Verification Rules

Run the smallest relevant checks first:

```bash
npm test
pytest path/to/focused_test.py
mvn -pl module-name -Dtest=FocusedTest test
go test ./path/to/package
```

When the change spans modules, run the broader module or repository check when practical.

If automated checks are unavailable, the QA agent must report that explicitly and provide manual regression steps.

## 7. Completion Checklist

Before calling a task complete:

- The coordinator listed affected domains.
- Each implementation agent stayed inside its ownership boundary.
- Hotspot files had only one active owner.
- Behavior changes passed PRD/spec gates when required.
- Documentation is updated or explicitly marked unchanged.
- Tests or manual regression steps are recorded.
- Residual risks and skipped checks are stated.
