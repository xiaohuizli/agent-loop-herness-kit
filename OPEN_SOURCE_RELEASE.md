# Open Source Release Checklist

发布到 GitHub 前完成以下检查。

## 仓库准备

- [ ] 选择仓库名，例如 `agent-loop-harness-kit`。
- [ ] 确认 `LICENSE` 文件存在，并且版权信息适合发布主体。
- [ ] 删除任何公司、客户、私有项目、密钥、内部域名或数据库信息。
- [ ] 确认 Git 提交作者使用发布主体或通用身份，不包含个人姓名或邮箱。
- [ ] 确认示例不包含未授权引用的 PDF 原文或受版权保护的大段内容。
- [ ] 运行 `npm test`，检查必需文件、验证入口、Skill 契约、状态模板和常见敏感信息模式。
- [ ] 运行 Markdown 链接检查或人工检查相对路径。

## Skill 检查

- [ ] `skills/agent-loop-harness/SKILL.md` frontmatter 只有 `name` 和 `description`。
- [ ] `name` 使用小写字母、数字和连字符。
- [ ] `description` 说明触发场景。
- [ ] Skill 内容不是一次性故事，而是可复用流程。
- [ ] 压力测试场景至少覆盖：无 Done、自我验收、重复失败、多 Agent 冲突、危险操作。

## 文档检查

- [ ] README 能让新用户 5 分钟内理解用途和接入方式。
- [ ] `docs/loop-rules.md` 描述原则。
- [ ] `docs/adoption-guide.md` 描述落地步骤。
- [ ] `templates/` 可直接复制到项目中使用。

## 发布流程

```bash
git init
git add .
git commit -m "Initial agent loop harness kit"
git branch -M main
git remote add origin https://github.com/<owner>/agent-loop-harness-kit.git
git push -u origin main
```

## 后续路线

- [ ] 增加 `scripts/validate-harness`，自动检查目标项目是否具备指令、状态、验证、范围、生命周期五个子系统。
- [ ] 增加 `examples/`，展示 Java/Maven、Node、Python 三类项目接入样例。
- [ ] 增加 GitHub Actions 示例，用于 CI 看护 Loop。
- [ ] 对 Skill 做独立 forward-test，记录失败前后对比。
