# Content Alchemy

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A Claude Code skill that transforms raw ideas into professional articles through a 5-stage semi-automated pipeline.

> 内容炼金术 -- 从选题到成稿的 5 阶段半自动写作管线。Claude Code Skill。

## What It Does

| Stage | Name | Output |
|-------|------|--------|
| 1 | Topic Mining | `mining-report.md` |
| 2 | Source Extraction | Source Authenticity Report |
| 3 | Deep Analysis | Source Truth Table |
| 3.5 | Cross-Reference | Cross-Reference Report |
| 4 | Refining | `manifesto.md` |
| 5 | Humanized Article | `article.md` |

> 每个阶段都有 checkpoint，需要用户确认后才会继续。不会偷偷编造内容。

## Installation

```bash
# Clone and install as a Claude Code skill
git clone https://github.com/AliceLJY/content-alchemy.git
claude skill add ./content-alchemy
```

## Usage

```
alchemy AI and loneliness     # Full pipeline from topic
alchemy-setup                  # Check/download dependencies
```

Start from any stage:
- **Topic Mode**: `alchemy [topic]` -- full pipeline from Stage 1
- **Source Mode**: provide transcripts/articles -- starts from Stage 3
- **Draft Mode**: hand off to content-publisher

> 支持中途跳入：有素材直接从 Stage 3 开始，有成稿直接交给 content-publisher 发布。

## Ecosystem

| Repo | Role |
|------|------|
| **content-alchemy** (this) | Research + Writing (Stages 1-5) |
| [content-publisher](https://github.com/AliceLJY/content-publisher) | Distribution + Cleanup (Stages 6-7) |

> content-alchemy 产出 article.md，content-publisher 负责排版发布到微信公众号。

## Structure

```
content-alchemy/
├── SKILL.md                          # Skill definition (~150 lines)
├── references/
│   ├── stage1-mining.md              # Topic identification + search strategies
│   ├── stage2-extraction.md          # Multi-channel mining + fallback chain
│   ├── stage3-analysis.md            # 5-dimension analysis + Truth Table
│   ├── stage3.5-crossref.md          # Cross-reference verification methodology
│   ├── stage4-refining.md            # First-principles narrative reconstruction
│   ├── stage5-writing.md             # Humanized writing + anti-AI principles
│   ├── source-channels.md            # Search source priority by topic type
│   └── video-acquisition.md          # 6 video extraction methods + fallback chain
├── scripts/
│   ├── format-text.ts                # Chinese punctuation + spacing formatter
│   └── preprocess_article.py         # Markdown to HTML preprocessor
└── templates/
    └── cross-reference-report.md     # Stage 3.5 report template
```

## License

MIT
