# Content Alchemy

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A Claude Code skill that transforms raw ideas into professional articles through a 5-stage semi-automated pipeline.

> 内容炼金术 — 从选题到成稿的 5 阶段半自动写作管线。Claude Code Skill。

## What It Does

| Stage | Name | Output |
|-------|------|--------|
| 1 | Topic Mining | `mining-report.md` |
| 2 | Source Extraction | Source Authenticity Report |
| 3 | Deep Analysis | Source Truth Table |
| 3.5 | Cross-Reference | Cross-Reference Report |
| 4 | Refining | `manifesto.md` |
| 5 | Humanized Article | `article.md` |

Every stage pauses for user confirmation before proceeding. No hallucination — every claim traces back to a verifiable source.

> 每个阶段都有 checkpoint，需要用户确认后才会继续。不会偷偷编造内容。

## Why This Is Different

| Problem | Solution |
|---------|----------|
| AI makes up data | Source Truth Table forces citations |
| Source exists but data is wrong | Stage 3.5 Cross-Reference: multi-source verification |
| Article reads like AI | 7 anti-AI writing principles + 6-dimension scan |
| Uncertain facts slip through | Confidence self-assessment: uncertain → downgrade or mark [TBD] |

> 不只是"写得像人"，从源头开始防幻觉。事实核查 + 交叉验证 + 置信度自评三重保险。

## Installation

```bash
git clone https://github.com/AliceLJY/content-alchemy.git
claude skill add ./content-alchemy
```

## Usage

```
alchemy AI and loneliness     # Full pipeline from topic
alchemy-setup                  # Check/download dependencies
```

Start from any stage:
- **Topic Mode**: `alchemy [topic]` — full pipeline from Stage 1
- **Source Mode**: provide transcripts/articles — starts from Stage 3
- **Draft Mode**: hand off to content-publisher for publishing

> 支持中途跳入：有素材直接从 Stage 3 开始，有成稿直接交给 content-publisher 发布。

## Structure

```
content-alchemy/
├── SKILL.md                          # Skill definition (~150 lines)
├── references/
│   ├── stage1-mining.md              # Topic identification + search strategies
│   ├── stage2-extraction.md          # Multi-channel mining + fallback chain
│   ├── stage3-analysis.md            # 5-dimension analysis + Truth Table
│   ├── stage3.5-crossref.md          # Cross-reference verification
│   ├── stage4-refining.md            # First-principles narrative reconstruction
│   ├── stage5-writing.md             # Humanized writing + anti-AI principles
│   ├── source-channels.md            # Search source priority by topic type
│   └── video-acquisition.md          # 6 video extraction methods + fallback
├── scripts/
│   ├── format-text.ts                # Chinese punctuation + spacing formatter
│   └── preprocess_article.py         # Markdown to HTML preprocessor
└── templates/
    └── cross-reference-report.md     # Stage 3.5 report template
```

## Ecosystem

| Repo | Role |
|------|------|
| **content-alchemy** (this) | Research + Writing (Stages 1-5) |
| [content-publisher](https://github.com/AliceLJY/content-publisher) | Images + Layout + Publishing + Cleanup |
| [digital-clone-skill](https://github.com/AliceLJY/digital-clone-skill) | Extract writing DNA for personalized output |
| [openclaw-content-alchemy](https://github.com/AliceLJY/openclaw-content-alchemy) | Standard edition: bot config + 56 art styles |
| [openclaw-worker](https://github.com/AliceLJY/openclaw-worker) | Bot worker for automated task execution |
| [openclaw-cc-pipeline](https://github.com/AliceLJY/openclaw-cc-pipeline) | Multi-turn Claude Code orchestration pipeline |

> content-alchemy 产出 article.md，content-publisher 负责配图、排版、发布到微信公众号。

## Version History

| Version | Era | Highlights |
|---------|-----|------------|
| v1.0–2.5 | Antigravity | Project inception → 9-stage → 7-stage workflow |
| v3.1–3.2 | Claude Code (Opus 4.5) | Bug fixes, fallback mechanisms, doc restructuring |
| v4.0–4.3 | Claude Code (Opus 4.6) | Chrome reuse, Bilibili extraction, Cross-Reference (3.5), 6-dim AI scan |
| **v5.0** | Claude Code (Opus 4.6) | **Split into content-alchemy + content-publisher**. SKILL.md 1258→210 lines (-83%), progressive reference loading |

> v4.4 以前是单体仓库（已归档为 [content-alchemy-legacy](https://github.com/AliceLJY/content-alchemy-legacy)，tag `v4.4-final`）。v5.0 拆分为写作侧 + 发布侧两个独立项目。

## Author

Built by **小试AI** ([@AliceLJY](https://github.com/AliceLJY)) · WeChat: **我的AI小木屋**

> 医学出身，文化口工作，AI 野路子。公众号六大板块：AI实操手账 · AI踩坑实录 · AI照见众生 · AI冷眼旁观 · AI胡思乱想 · AI视觉笔记

Six content pillars: **Hands-on AI** · **AI Pitfall Diaries** · **AI & Humanity** · **AI Cold Eye** · **AI Musings** · **AI Visual Notes**

<img src="./assets/wechat_qr.jpg" width="200" alt="WeChat QR Code — 我的AI小木屋">

---

## License

MIT
