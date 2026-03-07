# Content Alchemy

**English** | [简体中文](README_CN.md)

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A Claude Code skill that transforms raw ideas into professional articles through a 5-stage semi-automated pipeline.

## Tested Environment

- This repository has only been tested in the author's personal Claude Code CLI workflow.
- macOS
- Claude Code
- Bun
- Python 3
- Local article output directory on Desktop: `~/Desktop/bot-articles/`

## Compatibility Notes

- This repository is not guaranteed to work on Linux or Windows.
- Some paths are hardcoded around the author's local workspace conventions.
- Users may need to replace persona and style asset paths.
- Downstream publishing depends on `content-publisher`.

## Prerequisites

- Claude Code
- Bun
- Python 3
- A writable `~/Desktop/bot-articles/`
- Optional local persona and style assets if you want the same workflow quality

## Local Assumptions

- Output directory: `~/Desktop/bot-articles/{topic-slug}/`
- Persona source: `~/.claude/projects/*/memory/writing-persona.md`
- Style catalog: `~/.openclaw-antigravity/workspace/images/style-catalog.md`
- Style history: `~/.openclaw-antigravity/workspace/images/style-history.txt`

## Known Limits

- This is not a one-click article generator.
- Every stage requires human confirmation.
- Path assumptions reflect the author's own machine.
- Publication is handled by another repo: `content-publisher`.

## What It Does

| Stage | Name | Output |
|-------|------|--------|
| 1 | Topic Mining | `mining-report.md` |
| 2 | Source Extraction | Source Authenticity Report |
| 3 | Deep Analysis | Source Truth Table |
| 3.5 | Cross-Reference | Cross-Reference Report |
| 4 | Refining | `manifesto.md` |
| 5 | Humanized Article | `article.md` |

Every stage pauses for user confirmation before proceeding. Every claim is expected to trace back to a verifiable source.

## Why This Is Different

| Problem | Solution |
|---------|----------|
| AI makes up data | Source Truth Table forces citations |
| Source exists but data is wrong | Stage 3.5 Cross-Reference adds multi-source verification |
| Article reads like AI | 7 anti-AI writing principles plus a 6-dimension scan |
| Uncertain facts slip through | Confidence self-assessment downgrades or marks weak claims |

## Installation

```bash
git clone https://github.com/AliceLJY/content-alchemy.git
claude skill add ./content-alchemy
```

## Usage

```text
alchemy AI and loneliness     # Full pipeline from topic
alchemy-setup                 # Check/download dependencies
```

Start from any stage:

- Topic Mode: `alchemy [topic]` starts from Stage 1
- Source Mode: provide transcripts or articles to start from Stage 3
- Draft Mode: hand off to content-publisher when `article.md` already exists

## Structure

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

## Ecosystem

| Repo | Role |
|------|------|
| **content-alchemy** (this repo) | Research and writing, Stages 1-5 |
| [content-publisher](https://github.com/AliceLJY/content-publisher) | Images, layout, publishing, cleanup |
| [openclaw-worker](https://github.com/AliceLJY/openclaw-worker) | Task API and Docker Compose for OpenClaw |
| [openclaw-cli-bridge](https://github.com/AliceLJY/openclaw-cli-bridge) | Three-way bridge for `/cc`, `/codex`, and `/gemini` |
| [digital-clone-skill](https://github.com/AliceLJY/digital-clone-skill) | Build digital clones from corpus data |
| [local-memory](https://github.com/AliceLJY/local-memory) | Local AI conversation search |
| [cc-shell](https://github.com/AliceLJY/cc-shell) | Lightweight Claude Code chat UI |
| [telegram-ai-bridge](https://github.com/AliceLJY/telegram-ai-bridge) | Telegram bots for Claude, Codex, and Gemini |
| [telegram-cli-bridge](https://github.com/AliceLJY/telegram-cli-bridge) | Telegram CLI bridge for the Gemini CLI path |

## Version History

| Version | Era | Highlights |
|---------|-----|------------|
| v1.0-v2.5 | Antigravity | Project inception, then 9-stage to 7-stage workflow evolution |
| v3.1-v3.2 | Claude Code (Opus 4.5) | Bug fixes, fallback mechanisms, doc restructuring |
| v4.0-v4.3 | Claude Code (Opus 4.6) | Chrome reuse, Bilibili extraction, Cross-Reference, 6-dimension AI scan |
| v5.0 | Claude Code (Opus 4.6) | Split into content-alchemy and content-publisher, with progressive reference loading |

## Author

Built by **小试AI** ([@AliceLJY](https://github.com/AliceLJY)) for the WeChat public account **我的AI小木屋**.

Six content pillars: **Hands-on AI**, **AI Pitfall Diaries**, **AI and Humanity**, **AI Cold Eye**, **AI Musings**, and **AI Visual Notes**.

<img src="./assets/wechat_qr.jpg" width="200" alt="WeChat QR Code — 我的AI小木屋">

## License

MIT
