# Content Alchemy

[English](README.md) | **简体中文**

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

一个 Claude Code Skill，用 5 个半自动阶段把原始想法转成可发布的文章。

## 测试环境

- 这个仓库只在作者自己的 Claude Code CLI 工作流里实测过。
- macOS
- Claude Code
- Bun
- Python 3
- 桌面本地文章输出目录：`~/Desktop/bot-articles/`

## 兼容性说明

- 这个仓库不保证在 Linux 或 Windows 上可用。
- 部分路径是按作者本地工作区约定写死的。
- 用户可能需要替换 persona 和风格资产路径。
- 下游发布依赖 `content-publisher`。

## 前置条件

- Claude Code
- Bun
- Python 3
- 可写的 `~/Desktop/bot-articles/`
- 如果想达到相同工作流质量，可选准备本地 persona 和风格资产

## 本地假设

- 输出目录：`~/Desktop/bot-articles/{topic-slug}/`
- Persona 来源：`~/.claude/projects/*/memory/writing-persona.md`
- 风格目录：`~/.openclaw-antigravity/workspace/images/style-catalog.md`
- 风格历史：`~/.openclaw-antigravity/workspace/images/style-history.txt`

## 已知限制

- 这不是一键式文章生成器。
- 每个阶段都需要人工确认。
- 路径假设反映的是作者自己的机器环境。
- 发布由另一个仓库 `content-publisher` 负责。

## 它能做什么

| 阶段 | 名称 | 输出 |
|------|------|------|
| 1 | 选题挖掘 | `mining-report.md` |
| 2 | 素材提取 | Source Authenticity Report |
| 3 | 深度分析 | Source Truth Table |
| 3.5 | 交叉核查 | Cross-Reference Report |
| 4 | 观点提炼 | `manifesto.md` |
| 5 | 人味成稿 | `article.md` |

每个阶段都会停下来等待用户确认后再继续。所有结论都应当能追溯到可核验的来源。

## 它和普通写作 Skill 的区别

| 问题 | 解决方式 |
|------|----------|
| AI 会编数据 | Source Truth Table 强制逐条挂来源 |
| 有来源但数据本身不对 | Stage 3.5 Cross-Reference 做多源交叉验证 |
| 成稿一看就是 AI 写的 | 7 条去 AI 写作原则加 6 维扫描 |
| 不确定的信息混进正文 | 置信度自评会把弱论断降级或标注出来 |

## 安装

```bash
git clone https://github.com/AliceLJY/content-alchemy.git
claude skill add ./content-alchemy
```

## 用法

```text
alchemy AI and loneliness     # 从选题开始跑完整流程
alchemy-setup                 # 检查或下载依赖
```

可以从任意阶段切入：

- Topic Mode: `alchemy [topic]` 从 Stage 1 开始
- Source Mode: 提供转录稿或文章，从 Stage 3 开始
- Draft Mode: 已经有 `article.md` 时直接交给 content-publisher

## 目录结构

```text
content-alchemy/
├── README.md
├── README_CN.md
├── SKILL.md
├── references/
│   ├── stage1-mining.md
│   ├── stage2-extraction.md
│   ├── stage3-analysis.md
│   ├── stage3.5-crossref.md
│   ├── stage4-refining.md
│   ├── stage5-writing.md
│   ├── source-channels.md
│   └── video-acquisition.md
├── scripts/
│   ├── format-text.ts
│   ├── preprocess_article.py
│   └── sync-codex-skill.sh
├── templates/
│   └── cross-reference-report.md
└── assets/
    └── wechat_qr.jpg
```

## 生态位

| 仓库 | 角色 |
|------|------|
| **content-alchemy**（本仓库） | 负责调研与写作，覆盖 Stage 1-5 |
| [content-publisher](https://github.com/AliceLJY/content-publisher) | 负责配图、排版、发布和清理 |
| [openclaw-worker](https://github.com/AliceLJY/openclaw-worker) | OpenClaw 的任务 API 和 Docker Compose |
| [openclaw-cli-bridge](https://github.com/AliceLJY/openclaw-cli-bridge) | `/cc`、`/codex`、`/gemini` 三路桥接 |
| [digital-clone-skill](https://github.com/AliceLJY/digital-clone-skill) | 从语料构建数字分身 |
| [local-memory](https://github.com/AliceLJY/local-memory) | 本地 AI 对话搜索 |
| [cc-shell](https://github.com/AliceLJY/cc-shell) | 轻量 Claude Code 聊天界面 |
| [telegram-ai-bridge](https://github.com/AliceLJY/telegram-ai-bridge) | Claude、Codex、Gemini 的 Telegram 机器人 |
| [telegram-cli-bridge](https://github.com/AliceLJY/telegram-cli-bridge) | 面向 Gemini CLI 路径的 Telegram CLI 桥 |

## 版本历史

| 版本 | 时期 | 重点变化 |
|------|------|----------|
| v1.0-v2.5 | Antigravity | 项目起步，以及从 9 阶段到 7 阶段的流程演化 |
| v3.1-v3.2 | Claude Code（Opus 4.5） | 修 bug、补 fallback、重组文档 |
| v4.0-v4.3 | Claude Code（Opus 4.6） | Chrome 复用、Bilibili 提取、Cross-Reference、6 维 AI 味扫描 |
| v5.0 | Claude Code（Opus 4.6） | 拆分成 content-alchemy 和 content-publisher，并采用按需加载引用文件 |

## 作者

作者是 **小试AI** ([@AliceLJY](https://github.com/AliceLJY))，公众号为 **我的AI小木屋**。

六个内容方向：**AI 实操手账**、**AI 踩坑实录**、**AI 照见众生**、**AI 冷眼旁观**、**AI 胡思乱想**、**AI 视觉笔记**。

<img src="./assets/wechat_qr.jpg" width="200" alt="微信公众号二维码 — 我的AI小木屋">

## License

MIT
