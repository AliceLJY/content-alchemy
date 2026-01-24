# 📝 更新日志

记录项目的重要更新和改进。

---

## [v3.1] - 2025-01-25

### ✨ 新功能

- **微信公众号自动发布** - 一键发布文章到微信，节省 70% 时间
  - 自动填写标题
  - 自动粘贴内容（保持格式）
  - 自动插入所有图片
  - 自动保存草稿
- **新手友好文档** - 重写所有文档，更加易懂
  - [WECHAT-PUBLISH.md](./WECHAT-PUBLISH.md) - 微信发布完整指南
  - [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md) - 项目结构说明
  - [BEGINNER-GUIDE.md](./BEGINNER-GUIDE.md) - 新手补充指南

### 🐛 Bug 修复

- **修复粘贴问题** - 解决微信拒绝粘贴 HTML 内容的问题
  - 原因: 切换标签页导致焦点变化，微信检测并拒绝
  - 修复: 直接使用系统剪贴板，不打开新标签页
  - 文件: `wechat-article.ts` 第 81-98 行
- **修复依赖缺失** - 补全 Baoyu 的依赖包
  - 创建 `package.json` 包含所有必要依赖
  - 降级 `marked` 到 v9.1.6 解决兼容性问题

### 🔧 改进

- **Markdown 转换器** - 创建简化版转换器
  - 支持标准 Markdown `![]()`
  - 支持 Antigravity 中文符号 `！【】（）`
  - 自动处理中文句号 `。` → `.`
  - 生成图片占位符 `[[IMAGE_PLACEHOLDER_N]]`
- **脚本整理** - 简化脚本结构
  - 创建统一的 `publish.sh` 发布脚本
  - 归档 18 个旧的测试/调试脚本到 `.archive/`
  - 保留 7 个核心脚本
- **文档优化** - 删除 8 个测试/调试文档
  - 保留 6 个核心文档
  - 所有文档重写为新手友好风格

### 📚 文档变更

**新增**:
- `WECHAT-PUBLISH.md` - 微信发布完整指南（新手友好）
- `PROJECT-STRUCTURE.md` - 项目结构说明
- `CHANGELOG.md` - 更新日志（本文件）

**更新**:
- `README.md` - 添加微信发布功能介绍
- `BEGINNER-GUIDE.md` - 优化新手指南

**删除**:
- `scripts/修复粘贴问题.md`
- `scripts/修复说明.md`
- `scripts/普通用户自动化发布方案.md`
- `scripts/测试报告.md`
- `scripts/简易发布方案.md`
- `scripts/粘贴问题修复完成.md`
- `scripts/问题诊断报告.md`
- `scripts/如何发布到微信.md`

### 🗂️ 文件变更

**核心脚本** (scripts/):
- ✅ `publish.sh` - 新增（统一的发布脚本）
- ✅ `simple-md-to-html.ts` - 新增（简化 Markdown 转换器）
- ✅ `setup.sh` - 保留（安装脚本）
- ✅ `doctor.sh` - 保留（健康检查）
- ✅ `fix-baoyu-dependencies.sh` - 保留（依赖修复）
- ✅ `format-text.ts` - 保留（格式化工具）
- ✅ `preprocess_article.py` - 保留（预处理脚本）

**已归档** (.archive/old-scripts/):
- 📦 `test-publish.sh`
- 📦 `publish-fixed.sh`
- 📦 `publish-v2.sh`
- 📦 15 个调试/测试脚本

### ⚙️ 技术细节

**修复的核心问题**:

1. **粘贴问题**
   ```
   旧流程: 打开新标签 → 复制 → 关闭标签 → 焦点变化 → 微信拒绝
   新流程: 系统剪贴板 → 直接粘贴 → 无焦点变化 → 成功
   ```

2. **依赖缺失**
   ```
   问题: package.json 不存在
   修复: 创建 package.json，包含 marked, fflate, katex 等
   ```

3. **中文符号支持**
   ```
   Antigravity 格式: ！【图片】（路径。png）
   标准格式: ![图片](路径.png)
   修复: 两种格式都支持
   ```

**修改的文件**:
- `wechat-article.ts` - 替换 `copyHtmlFromBrowser()` 为 `copyHtmlDirectly()`
- `md-to-wechat.ts` - 改为调用简化版转换器
- `package.json` - 新建，包含所有依赖

---

## [v2.6] - 2025-01-23

### 文档优化

- 优化安装文档
- 添加新手指南
- 改进工作流说明

---

## [v2.0-v2.5] - 2024-2025

### 功能迭代

- 实现 7 阶段 Alchemy 工作流
- 添加 Source Truth Table
- 改进 Mining → Refining → Building 流程
- 优化图片生成

---

## [v1.0] - 2024

### 初始版本

- 基础 Alchemy 工作流
- 集成 Baoyu 微信发布
- 多 Skill 协同架构

---

## 版本号说明

格式: `v主版本.次版本`

- **主版本**: 重大功能变更或架构调整
- **次版本**: 功能增强、Bug 修复、文档优化

---

## 贡献者

- **AliceLJY** - 项目维护者
- **Claude Code (Anthropic)** - v3.1 修复和文档优化
- **Baoyu (宝玉)** - 微信 CDP 自动化核心代码
- **YouMind-OpenLab** - 图像提示词推荐
- **Lynne Liu** - 思维链提示词灵感

---

*查看完整提交记录: [GitHub Commits](https://github.com/你的用户名/content-alchemy-repo/commits)*
