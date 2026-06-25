# 项目接入指南

## 适用项目

这套 harness 适合以下项目：

- 需要 AI Agent 长期参与开发。
- 有测试、CI、构建、SQL 或可执行回归步骤。
- 任务经常跨会话中断。
- 有多模块或多领域协作需求。
- 希望把 Agent 行为从“凭聊天记忆”变成“凭状态和证据”。

不适合：

- 没有任何验证方式的纯探索任务。
- 一次性脚本或临时草稿。
- 无法接受状态文件或流程约束的项目。

## 接入步骤

### Step 1：建立根指令

在项目根目录创建或更新：

- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`

至少包含：

- 项目概览
- 启动流程
- 代码范围规则
- 验证命令
- Definition of Done
- End of Session
- Loop Operating Contract

可从 `templates/AGENTS-loop-contract.md` 开始。

### Step 2：建立状态层

建议最小状态文件：

```text
feature_list.json
progress.md
session-handoff.md
```

如果项目很小，可以只保留 `progress.md`。

状态文件要回答：

- 当前目标是什么？
- 最近失败是什么？
- 已经验证了什么？
- 下次恢复从哪里开始？

### Step 3：定义验证入口

准备一个最小可运行验证入口：

```bash
./init.sh
```

或在根指令中明确：

```bash
npm test
mvn -Dmaven.test.skip=false -DskipTests=false test
pytest
go test ./...
```

如果全量验证很慢，补充 focused checks。

### Step 4：加入 Loop 契约

每个多轮任务开始前写清：

```text
Goal:
Scope:
Done:
State:
Feedback:
Guardrails:
Verifier:
```

这一步是防止 Agent 跑偏的核心。

### Step 5：多 Agent 只做必要分工

当任务有两个以上独立工作流时，再建立：

```text
.agent-team/team.yaml
.agent-team/start.md
.agent-team/prompts/*.md
```

可从本仓库的 `templates/agent-team/` 复制通用模板。该模板只包含 coordinator-led 路由、非重叠 ownership、agent prompt 和 QA 验证规则；不要把目标项目的数据库连接脚本、凭据读取脚本或环境私有工具写入通用模板。

每个 Agent 的 prompt 必须包含：

- 角色
- ownership
- 禁止事项
- 输出格式
- 验证责任

### Step 6：运行压力测试

用 `tests/pressure-scenarios.md` 的场景检查 Agent 是否会：

- 没有 Done 就开跑
- 忽略失败日志
- 自己验证自己
- 越权修改文件
- 遇到生产数据操作不询问
- 循环多轮无进展仍继续

发现问题后，把对应反模式补进根指令或 Skill。

## 推荐目录结构

```text
project-root/
  AGENTS.md
  feature_list.json
  progress.md
  session-handoff.md
  init.sh
  .agent-team/
    start.md
    team.yaml
    prompts/
```

## 成熟度分级

### Level 1：单 Agent Closed Loop

适合小修复和单模块变更。

要求：

- 有 Done
- 有 focused verification
- 失败写回状态层

### Level 2：Generator-Verifier

适合业务状态机、计费、权限、数据迁移、外部回调等高风险变更。

要求：

- 实现者和验证者分离
- 测试或回归清单可执行
- blocker 明确记录

### Level 3：Coordinator-Worker

适合跨模块开发。

要求：

- coordinator 只分解、路由、合并
- worker 有非重叠 ownership
- 中间结果写入共享状态，不塞满 coordinator 上下文

### Level 4：Scheduled Loop

适合 CI 看护、PR 评论响应、文档同步。

要求：

- 严格预算
- 自动停止条件
- 人类审批门
- 审计日志
