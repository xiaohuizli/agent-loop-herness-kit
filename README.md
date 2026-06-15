# Agent Loop Harness Kit

把 Agent Loop 工程范式沉淀为可复制的项目 harness、Skill 和协作规则。

这套规则适用于需要 AI Agent 参与开发、测试、文档、CI 修复、PR 响应、多 Agent 分工和跨会话恢复的软件项目。它的目标不是让 Agent 无限自运行，而是让 Agent 在清晰目标、外部状态、验证门和护栏内反复改进。

## 核心公式

```text
Loop = Trigger + Decision + Feedback + Guardrails + Memory + Verification
```

换成项目实践：

- Trigger：用户请求、CI 失败、PR 评论、定时任务或看板任务。
- Decision：Agent 根据当前状态选择下一步，而不是固定脚本硬跑。
- Feedback：失败日志、diff、测试输出进入下一轮上下文。
- Guardrails：迭代上限、无进展停止、人类审批门、权限边界。
- Memory：`progress.md`、`feature_list.json`、看板、issue、git 记录等外部状态。
- Verification：测试、lint、SQL 校验、QA agent、独立 review 或人工回归清单。

## 仓库内容

```text
skills/agent-loop-harness/SKILL.md  # 可安装到 Codex/Agent 的 Skill
docs/loop-rules.md                  # 通用范式规则
docs/adoption-guide.md              # 任意项目接入指南
templates/AGENTS-loop-contract.md   # 可粘贴到 AGENTS.md/CLAUDE.md
templates/progress-loop-state.md    # progress.md 状态模板
tests/pressure-scenarios.md         # Skill 压力测试场景
OPEN_SOURCE_RELEASE.md              # 发布到 GitHub 前检查清单
```

## 最小接入方式

1. 把 `templates/AGENTS-loop-contract.md` 合并到目标项目的 `AGENTS.md` 或 `CLAUDE.md`。
2. 在项目根目录准备 `progress.md` 作为 Loop 状态层。
3. 给每个任务先定义 `Goal / Scope / Done / Guardrails / Verifier`。
4. 行为变更必须经过测试、QA agent、独立 review 或明确的人工回归清单。
5. 多 Agent 只在存在独立工作流时启用，并且先声明文件 ownership。

## Skill 安装

把 `skills/agent-loop-harness` 复制到你的 Codex skills 目录，例如：

```powershell
Copy-Item -Recurse .\skills\agent-loop-harness "$env:USERPROFILE\.codex\skills\agent-loop-harness"
```

然后在新项目中请求：

```text
使用 agent-loop-harness，帮这个项目建立可恢复、可验证、带护栏的 Agent Loop harness。
```

## 验证

发布或修改前运行：

```bash
npm test
```

该命令会检查必需文件、验证入口、Skill 契约、状态模板、Git 作者元数据，以及常见敏感信息模式。检查输出只报告风险类型和位置，不打印疑似敏感原文。
