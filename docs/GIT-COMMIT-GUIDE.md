# 🚀 Git 提交指南

快速提交你的更新到 GitHub。

---

## ✅ 准备好了吗？

检查清单:
- ✓ 微信发布功能测试成功
- ✓ 所有文档已更新
- ✓ 旧文件已归档

---

## 📝 提交步骤（复制粘贴即可）

### 1. 查看改动

```bash
git status
```

**你会看到**:
- 新增文件: WECHAT-PUBLISH.md, PROJECT-STRUCTURE.md, CHANGELOG.md
- 修改文件: README.md, wechat-article.ts, md-to-wechat.ts
- 新增脚本: scripts/publish.sh, scripts/simple-md-to-html.ts
- 归档文件: .archive/old-scripts/

---

### 2. 添加所有改动

```bash
git add .
```

---

### 3. 提交更改

**推荐提交信息**:

```bash
git commit -m "v3.1: 修复微信粘贴问题，优化新手文档

✨ 新功能
- 微信公众号自动发布（一键发布，节省70%时间）
- 新增 WECHAT-PUBLISH.md（新手友好的发布指南）
- 新增 PROJECT-STRUCTURE.md（项目结构说明）
- 新增 CHANGELOG.md（更新日志）

🐛 Bug 修复
- 修复微信拒绝粘贴 HTML 的问题（焦点变化导致）
- 修复 Baoyu 依赖缺失问题
- 支持 Antigravity 中文符号格式

🔧 改进
- 创建统一的 publish.sh 发布脚本
- 归档 18 个旧脚本到 .archive/
- 所有文档改为新手友好风格
- 简化 Markdown 转换器

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### 4. 推送到 GitHub

```bash
git push origin main
```

或者（如果你的主分支是 master）:

```bash
git push origin master
```

---

### 5. 创建 Release（可选）

在 GitHub 网页上:

1. 进入你的仓库
2. 点击 "Releases" → "Create a new release"
3. 填写信息:
   - **Tag version**: `v3.1`
   - **Release title**: `v3.1 - 微信自动发布 + 新手友好优化`
   - **Description**: 复制 CHANGELOG.md 中的 v3.1 部分

---

## 🎯 简化版（只需 3 行命令）

```bash
git add .
git commit -m "v3.1: 修复微信粘贴问题，优化新手文档"
git push origin main
```

---

## 🔍 验证提交成功

访问你的 GitHub 仓库，应该看到:
- ✓ 最新提交时间
- ✓ 新文件出现在列表中
- ✓ README.md 显示更新后的内容

---

## ⚠️ 遇到问题？

### 问题 1: "Your branch is behind..."

**原因**: 远程仓库有更新

**解决**:
```bash
git pull origin main
git push origin main
```

---

### 问题 2: "Permission denied"

**原因**: 没有配置 SSH 或 Token

**解决**: 使用 GitHub Desktop 或者配置 SSH

---

### 问题 3: "Merge conflict"

**原因**: 本地和远程有冲突

**解决**:
```bash
# 查看冲突文件
git status

# 手动解决冲突后
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

---

## 💡 提示

- 提交前先运行 `git status` 确认改动
- 提交信息要清晰，说明做了什么
- 定期推送，避免丢失工作

---

*需要帮助？查看 [GitHub 文档](https://docs.github.com/cn)*
