# 📝 更新日志

记录项目的重要更新和改进。

---

## [v4.0] - 2026-01-27

### ✨ 新功能

- **Chrome 复用** — 不再需要关闭所有 Chrome 窗口
  - 自动检测已有 Chrome 调试端口并复用
  - 优先找已登录的微信标签（`token=` 识别），避免新标签丢失登录态
  - 无调试端口时用独立 profile 启动新实例，不干扰用户浏览器
  - 新增 `--cdp-port <port>` 手动指定端口
  - 修复脚本完成后进程不退出的问题
  - ✅ 已合并到上游 baoyu-skills（[#23](https://github.com/JimLiu/baoyu-skills/pull/23)）

- **全 IDE 配图生成** — Claude Code 也能自动生图了
  - 通过 `baoyu-danger-gemini-web` skill（Gemini Web 反向 API）实现
  - 配合 `nano-banana-pro-prompts-recommend-skill` 优化 Prompt
  - Antigravity 不再是"唯一能自动生图"的 IDE

- **占位符格式统一** — 上游采纳了我们的兼容性建议
  - baoyu v1.23.0 将 `[[IMAGE_PLACEHOLDER_x]]` 改为 `WECHATIMGPH_x`
  - 解决了不同 Markdown 解析器对双方括号处理不一致的问题

### 🔧 改进

- **搜索效果说明** — 明确搜索结果质量受 AI 模型、提示词和搜索范围共同影响
  - 提示词的作用是限定搜索范围和内容类型，不保证结果质量
  - 不同 AI 模型对同一搜索指令的理解和执行能力不同

- **Skill 安装说明** — 新增懒人安装话术，降低入门门槛

- **项目文件整理** — 根目录临时文件清理，gitignore 更新

### 📚 贡献者

- **Claude Code (Opus 4.5)** — Chrome 复用开发、测试、PR 提交、文档更新
- **AliceLJY** — 需求定义、测试验证、Issue/PR 提交

---

## [v3.2] - 2026-01-25

### ✨ 新功能

- **视频采集 Fallback 机制** - 多种方法自动切换
  - 方法 1：yt-dlp 直接提取（首选）
  - 方法 2：NotebookLM 自动化导入（YouTube 最佳方案）
  - 方法 3：Browser DOM 提取
  - 方法 4：Live Search 替代视频
  - 方法 5：YouTube-First 策略（B站备用）

- **NotebookLM 自动化验证** - Chrome MCP 实测
  - ✅ 可获取 YouTube 完整 transcript（不只是摘要）
  - ❌ B站/小红书 仅能抓取页面文本，不能提取视频字幕

- **测试话术文档** - 复制即用
  - 完整流程测试
  - YouTube 视频提取（NotebookLM vs yt-dlp）
  - Fallback 链测试
  - 微信发布测试
  - 平台支持速查表

### 🔧 改进

- **写作风格指南重构**
  - 明确区分"个人示例" vs "通用框架"
  - 七大去 AI 味原则（通用）
  - 搜索策略按话题类型（通用）

- **移除坐标定位方案** - 微信有 2 种页面布局，坐标不稳定

- **README 亮点表格** - "你可能遇到的问题 → 我已经帮你解决了"

### 📚 贡献者

- **Claude Code (Opus 4.5)** - 主要开发：Fallback 机制、NotebookLM 测试、测试话术、文档重构
- **Antigravity** - 流程验证：实际运行 yt-dlp、微信发布等功能测试

---

## [v3.1] - 2026-01-25

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

### 📚 贡献者

- **Claude Code (Opus 4.5)** - Bug 修复、Markdown 转换器、文档重构
- **Antigravity** - 流程测试、微信发布验证

---

## [v2.6] - 2026-01-24

### 文档优化

- 优化安装文档
- 添加新手指南
- 改进工作流说明
- 添加 doctor.sh 环境检测脚本

### 📚 贡献者

- **Claude Code** - 文档优化
- **Antigravity** - 初始工作流设计

---

## [v2.5] - 2026-01-23

### 功能迭代

- Production Ready 版本
- 完善 7 阶段 Alchemy 工作流
- 添加 Source Truth Table（防 AI 幻觉）
- 优化图片生成流程
- 添加微信公众号二维码
- 重新定义自动化边界："端到端协作"而非"全自动化"

### 📚 贡献者

- **Antigravity** - 主要开发：工作流设计、微信集成

---

## [v2.0] - 2026-01-22

### 架构重构：9 → 7 阶段

**重要决策**：将 9 阶段精简为 7 阶段，更聚焦核心价值

- 新的 7 阶段 Alchemy 工作流
  - Stage 1: 选题挖掘
  - Stage 2: 素材采集
  - Stage 3: 深度分析
  - Stage 4: 知识炼化
  - Stage 5: 人性化写作
  - Stage 6: 分发（Flash-Publish）
  - Stage 7: 清理
- 集成 Baoyu 微信发布
- 多 Skill 协同架构
- 跨 IDE 兼容性说明

### 📚 贡献者

- **Antigravity** - 架构重构、工作流精简设计

---

## [v1.5] - 2026-01-21

### 扩展：4 → 9 阶段

**探索期**：扩展为更细粒度的 9 阶段工作流

1. 话题挖掘 - 智能选题
2. 素材采集 - 多源信息收集
3. 深度分析 - 信息提炼
4. 知识图谱 - 结构化知识
5. 内容撰写 - AI 辅助写作
6. 可视化 - 图文配合
7. 审核优化 - 质量把关
8. 分发发布 - 多渠道推送
9. 数据复盘 - 效果追踪

### 设计思考

- 更细粒度的流程控制
- 增加数据反馈环节
- 引入审核机制

### 📚 贡献者

- **Antigravity** - 工作流扩展设计

---

## [v1.0] - 2026-01-20

### 🎉 项目诞生！

**最初版本**：4 阶段工作流

| 阶段 | 名称 | 功能 |
|------|------|------|
| Stage 1 | Mining | 素材挖掘与采集 |
| Stage 2 | Refining | 内容精炼与分析 |
| Stage 3 | PPT | 知识可视化输出 |
| Stage 4 | Distribution | 内容分发 |

### 核心理念

- 多 Skill 协同作战
- 端到端内容生产
- AI 驱动的自动化流程

### 📚 贡献者

- **Antigravity** - 项目创始、核心架构设计

---

## 版本号说明

格式: `v主版本.次版本`

- **主版本**: 重大功能变更或架构调整
- **次版本**: 功能增强、Bug 修复、文档优化

---

## 贡献者总览

| 贡献者 | 角色 | 主要贡献 |
|-------|------|---------|
| **AliceLJY** | 项目维护者 | 需求定义、测试验证、最终审核 |
| **Claude Code (Opus 4.5)** | v3.1-v4.0 主要开发 | Bug 修复、Fallback 机制、NotebookLM 测试、Chrome 复用、全 IDE 配图、上游 PR、文档重构 |
| **Antigravity** | v1.0-v2.5 主要开发 | 项目创始、工作流演进（4→9→7阶段）、微信集成 |
| **Baoyu (宝玉)** | 核心依赖 | 微信 CDP 自动化核心代码 |
| **YouMind-OpenLab** | 核心依赖 | 图像提示词推荐 |
| **Lynne Liu** | 灵感来源 | 思维链提示词结构 |

---

*查看完整提交记录: [GitHub Commits](https://github.com/AliceLJY/content-alchemy/commits)*
