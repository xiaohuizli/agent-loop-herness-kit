# Agent Loop Harness 通用规则

## 1. 优先使用 Closed Loop

生产项目默认使用封闭循环：目标明确、路径有限、验证可执行、预算可控。

不要把模糊目标交给开放循环，例如“把项目做好”“自动优化所有代码”。这类目标会放大幻觉、范围蔓延和成本失控。

## 2. 先定义 Done

每个 Loop 启动前必须写清楚停止条件。

好的 Done：

- `mvn -pl service-a -Dtest=SomeTest test` 通过。
- `git diff --check` 通过。
- SQL 表、索引、seed 数据在目标库校验通过。
- API 响应符合指定字段和状态流转。
- QA agent 或 reviewer 明确给出通过结论和证据。

不好的 Done：

- “看起来可以”
- “应该修好了”
- “Agent 说完成了”
- “没有报错截图”

## 3. 状态必须在对话之外

Loop 的状态层可以是：

- `progress.md`
- `feature_list.json`
- issue / Linear / GitHub Project
- git commit / branch / PR
- 数据库验证记录
- CI 日志链接

状态层至少记录：

- 当前目标
- 当前尝试次数
- 上一轮失败原因
- 已修改文件
- 验证命令和结果
- blocker
- 下一条命令

## 4. 失败是下一轮输入

失败输出不是结论，而是下一轮 prompt 的材料。

必须捕获：

- diff 风险
- stdout / stderr
- 测试失败栈
- 编译错误
- SQL 错误
- 外部接口错误
- reviewer 评论

不要让 Agent 靠记忆复述失败；把失败写入状态层或下一轮上下文。

## 5. Maker 和 Checker 分离

实现者不能作为唯一验收者。

验证来源可以是：

- 自动化测试
- lint / type check / build
- SQL 查询
- QA agent
- 独立 reviewer
- 人工回归清单

高风险变更必须使用 generator-verifier 模式：一个 Agent 生成，一个 Agent 验证。

## 6. 多 Agent 需要 ownership

只有在存在独立工作流时才启用多 Agent。

适合多 Agent：

- API + Admin + SQL
- provider 接入 + billing + docs
- 并行审计多个模块
- 实现 agent + QA agent

不适合多 Agent：

- 单文件小修复
- 纯串行工作
- 需要多人同时改同一个热点文件

每个 Agent 必须声明：

- 可读范围
- 可写范围
- 输出契约
- 失败行为
- 验证责任

## 7. 护栏优先于速度

默认护栏：

- 聚焦实现 Loop：最多 3-5 轮。
- 跨模块 Loop：每个阶段都有 checkpoint。
- 连续两轮同根因失败：停止并报告 blocker。
- 生产数据修改、不可逆清理、真实付费 provider 调用、force push：必须人工确认。
- 失败必须 loud fail，禁止静默造假数据或占位完成。

## 8. Skills 是复利资产

重复出现的流程应该沉淀为 Skill：

- provider 接入
- SQL patch 验证
- CI 修复
- PR 评论响应
- 计费链路审查
- 多 Agent 任务分派
- 文档同步

Skill 只写可复用的判断和步骤，不写一次性故事。
