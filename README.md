# Content Alchemy Skill

🚀 **Getting Started**: [Setup Guide](./docs/SETUP.md) | [Beginner Guide](./docs/BEGINNER-GUIDE.md) | [WeChat Publishing](./docs/WECHAT-PUBLISH.md)
📚 **Deep Dive**: [Technical Docs](./SKILL.md) | [Project Structure](./docs/PROJECT-STRUCTURE.md)
🔄 **Quick Update**: `git pull && git submodule update --remote --merge`

**One-liner**: Let AI handle any or all stages of your content pipeline — Research → Analysis → Writing → Illustration → Publishing.

> 让 AI 帮你完成内容流水线的任意环节——调研 → 分析 → 写作 → 配图 → 发布。

---

## 🎯 What Can This Project Do For You?

> **Not just for WeChat!** Each stage can be used independently.

| Your Need | How to Use | Example Command |
|-----------|------------|-----------------|
| 📚 **Research only** | Stage 1-2 | "Collect comparison materials for Cursor vs Windsurf, organize into a doc" |
| 🔍 **Deep analysis only** | Stage 3 | "Analyze core arguments from these 3 YouTube videos, generate comparison table" |
| ✍️ **Writing only** | Stage 5 | "Rewrite these technical notes in blog style, no publishing needed" |
| 🎨 **Illustrations only** | Stage 5 | "Generate 3 illustrations for this article" |
| 📤 **Publish to WeChat only** | Stage 6 | "Publish article.md to WeChat drafts" |
| 🔄 **Full pipeline** | Stage 1-7 | "Write an article about XX, publish to WeChat" |

**Core Value**:
- 🧩 **Modular like LEGO** — Use only what you need, no forced full workflow
- 🛡️ **Anti-hallucination** — Source Truth Table + Cross-Reference double insurance
- ✨ **Human-sounding** — 7 writing principles to eliminate AI-speak
- 📖 **Beginner-friendly** — Verification steps at every stage, no coding required

**Ecosystem**:

> 这些项目配合使用效果更好

- 🤖 [digital-clone-skill](https://github.com/AliceLJY/digital-clone-skill) — Extract writing DNA for personalized Stage 5 output
- 📦 [openclaw-content-alchemy](https://github.com/AliceLJY/openclaw-content-alchemy) — Standard edition: bot config + 56 art styles for everyone
- 🔧 [openclaw-worker](https://github.com/AliceLJY/openclaw-worker) — Bot worker for automated task execution
- 🔗 [openclaw-cc-pipeline](https://github.com/AliceLJY/openclaw-cc-pipeline) — Multi-turn Claude Code orchestration pipeline

---

## 💡 Why This Project Is Different

> Not "just another template" — this is **battle-tested wisdom from countless pitfalls**.

**v4.3 Highlights (for serious users):**

From v4.1 to v4.3, iterated through multi-agent code review, source grading framework, Bilibili video extraction, and WeChat publishing improvements:

| Problem You Might Face | Already Solved | Version |
|------------------------|----------------|---------|
| 🤔 "Clone fails, path errors everywhere" | Removed all hardcoded paths; `publish.sh` auto-detects based on script location | v4.1 |
| 🤔 "AI makes up data" | Source Truth Table forces citations, eliminates hallucination | v4.1 |
| 🤔 "Source exists but data itself is wrong" | **Stage 3.5 Cross-Reference**: multi-source verification + concept confusion check + absolute claim scanner | v4.1 |
| 🤔 "Can't trust AI's numbers" | **Confidence self-assessment**: real-time evaluation during writing, uncertain data gets downgraded or removed | v4.1 |
| 🤔 "De-AI'd words but still reads like AI" | **6-dimension AI scan**: structure/syntax/vocab/emotion/meta-commentary/predictability | v4.1 |
| 🤔 "How to assess different source credibility?" | **Source grading framework**: hard data → trusted media → insider info → own estimates → social media, handled by tier | v4.2 |
| 🤔 "Bilibili video has no YouTube mirror" | **Playwright Bilibili extraction (Method 6)**: directly extract title/description/comments/danmaku/CC subtitles | v4.3 |
| 🤔 "Don't know what to reply to advance workflow on mobile" | **Next-step hints**: auto-prompts at each stage with shortcut words | v4.3 |
| 🤔 "Don't know if WeChat is logged in before publishing" | **WeChat login detection**: auto-check login status, pause if not logged in | v4.3 |
| 🤔 "Content pasted to address bar during consecutive publishes" | **Multi-tab focus issue**: remind to close extra editor tabs before publishing | v4.3 |
| 🤔 "Title appears twice in WeChat" | **Title format spec**: frontmatter `title:` is the sole title source, no `# H1` in body | v4.3 |

> Goal: New users can `git clone` and start using immediately — no hidden local config dependencies.

**Design Principles:**
- 📖 **Beginner-friendly**: No technical background assumed, verification at every step
- 🔧 **Customizable**: Writing style is example, search strategy is universal — adapt freely
- 🛡️ **Anti-hallucination**: Force AI to cite sources, not free-form generation
- ⚡ **Battle-tested**: Every design decision has a real pitfall story behind it

---

### 🤝 Human-AI Collaboration: The 90/10 Golden Ratio

This project pursues "rapid delivery with human oversight":
- **AI (90%)**: Topic selection, collection, analysis, fact-checking, writing, illustration, **auto-save to drafts**
- **HUMAN (10%)**:
  1. Source verification: Review Source Truth Table, ensure citations are real
  2. Draft polish: Aesthetic review in platform (cover, formatting)
  3. Modular entry: Start from any stage, AI auto-completes the rest

> **Core Logic**: AI handles tedious digital work; humans handle authenticity verification and aesthetic decisions.

### 📮 WeChat Auto-Publishing (Optional)

If you use WeChat Official Account, one-click publish to drafts:

- ✅ **API mode (recommended)**: Pure HTTP via WeChat Developer API, no browser needed, works headless for bot automation
- ✅ **Browser mode (fallback)**: Chrome CDP automation, for when API is not configured
- ✅ Runs locally, no third-party servers

> 💡 See [WECHAT-PUBLISH.md](./docs/WECHAT-PUBLISH.md) for detailed tutorial

**Don't use WeChat? No problem!** The core value is in research, analysis, and writing — output can be any Markdown file.

## 🔌 Skill Installation

This project depends on a few Claude Code Skills. Installation is simple — **just paste a link to AI**.

### Lazy Install (copy-paste into Claude Code)

**WeChat publishing (required):**
```
Help me install this skill: https://github.com/JimLiu/baoyu-skills
It's a git submodule, install to dependencies/baoyu-skills directory.
```

**Image generation (recommended):**
```
Help me install these two skills:
1. baoyu-danger-gemini-web (Gemini image generation)
2. nano-banana-pro-prompts-recommend-skill (image prompt optimization)
```

> Skills are stored in `~/.claude/skills/` and auto-detected by Claude Code. baoyu-skills as a git submodule requires `bun install` for dependencies.

### Manual Installation

```bash
# 1. Clone project
git clone --recurse-submodules https://github.com/AliceLJY/content-alchemy.git
cd content-alchemy

# 2. Install dependencies
bun install

# 3. Verify
bun ./dependencies/baoyu-skills/skills/baoyu-post-to-wechat/scripts/wechat-api.ts --help
```

> See [SETUP.md](./docs/SETUP.md) for detailed steps

---

## 📝 Acknowledgments & Credits

This project's core logic builds upon excellent Skills and prompt patterns from the open-source community. Special thanks to:

* **WeChat Publishing**:
  * **Skill**: `baoyu-post-to-wechat`
  * **Author**: **Baoyu** — CDP automation for WeChat Official Account

* **Image Prompt Recommendation**:
  * **Skill**: nano-banana-pro-prompts-recommend-skill
  * **Author**: **YouMind-OpenLab** — High-quality prompt library

* **Chain-of-Thought Prompts**:
  * **Prompt**: Chained Instructions
  * **Author**: **Lynne Liu**
  * **Source**: [YouMind Shortcut](https://youmind.com/zh-CN/shortcuts/P5cdEZdDzG51jA) — Inspiration for "Mining → Refining → Building" structure

* **Copyright Notice**: Base tools belong to original authors. I (AliceLJY) only orchestrated these atomic functions into a multi-Skill collaboration pattern based on personal workflow needs.

* **Tribute**: Thanks to all pioneers contributing intellectual assets to the AI ecosystem. Your open-source spirit makes "prompt-as-production" possible.

## ⚙️ Design Philosophy

This repository demonstrates a **"multi-Skill orchestration"** approach:
1. **End-to-end pipeline**: 7-stage alchemy from inspiration to draft saving
2. **Smart incremental updates**: Auto-detect and update existing drafts
3. **Self-evolving architecture**: Solidified 7-stage automation from "finding inspiration" to "digital asset distribution"

## 🧠 Design Decisions

This section explains the deeper reasons behind some "seemingly odd" designs.

### 1. Why YouTube over Bilibili?

**Misconception:** "Because Bilibili is blocked"
**Truth:** "Because of data accessibility"

- Bilibili: Creators may not enable subtitles, API extraction is difficult
- YouTube: Auto-generated subtitles, `yt-dlp` extracts easily

**Real case:**
Found a Bilibili video about AI computing, but no subtitles/transcript. Same search on YouTube found a mirror with full transcript instantly. This isn't censorship bypass — it's prioritizing **the path of least resistance for data**.

---

### 2. Why must Chrome use debug port?

**Misconception:** "This is optional technical detail"
**Truth:** "This is life-or-death for avoiding API rate limits"

**Pitfall experience:**
1. First test succeeded → thought Baoyu script handled it
2. Got 429 error → realized it wasn't using CDP, API was rate-limited
3. Ran Baoyu alone → browser didn't move, but showed "Done" → fake success

**Root cause:**
Baoyu script has two modes:
- **CDP Mode (requires 9222):** Real browser automation, stable
- **API Mode (no port needed):** Direct API calls, easily rejected

No port 9222 → script falls back to API mode → shows "Done" but no draft saved.

---

### 3. Why set cover image manually?

**Misconception:** "Can be fully automated"
**Truth:** "Mid-process operations are extremely risky"

**Test results:**
- Tried auto-clicking "Edit" button → got stuck
- Reason 1: Button only shows on hover, coordinates easily fail
- Reason 2: Copy action jumps to wrong dialog
- Reason 3: Paste position misaligned

**Best practice:**
1. Automation stops at "Save Draft"
2. User opens draft → selects first image as cover
3. Review formatting → manually click "Publish"

This isn't a "downgrade" — it's **the only stable approach**.

---

### 4. Why Source Truth Table?

**Misconception:** "This is technical documentation"
**Truth:** "This is the last line of defense against AI hallucination"

**Early version problem:**
AI only got video title + description + comments → fabricated stories from this "secondhand info".

**After improvement:**
Force AI to cite source for every claim:
- ✅ Mentioned at 12:34 in video → trustworthy
- ⚠️ Comment speculation → rephrase as "according to XX"
- ❌ No source found → AI made it up, delete

**Human's role:**
Judge whether the source is authoritative enough. AI cannot assess source credibility — only humans can make this decision.

---

### 5. Why does paste fail? (macOS Accessibility Permission)

**Misconception:** "The script has a bug"
**Truth:** "macOS requires permission for terminals to send keystrokes"

**Symptoms:**
Script log shows `Body content verified OK`, but the editor is empty and placeholders are not found.

**Root cause:**
The script uses `osascript` to send Cmd+C / Cmd+V keystrokes. macOS blocks terminal apps from sending key events by default for security reasons.

**Solution:**
Open **System Settings → Privacy & Security → Accessibility**, add your terminal app (Terminal, iTerm, VS Code, Cursor, etc.) to the list and enable permission.

> ⚠️ This is a one-time setup. Once authorized, no further action needed.

---

### 6. Why no need to close Chrome anymore?

**Misconception:** "You must close all browser windows to publish"
**Truth:** "That was an old limitation, fixed in v4.0"

**Pitfall:**
Every time you published to WeChat, you had to Cmd+Q all Chrome windows. Otherwise the script would fail due to profile directory lock conflict.

**v4.0 fix:**
Script auto-scans for existing Chrome debug ports before launch. If found, it reuses the existing browser. It prioritizes tabs already logged into WeChat (identified by `token=` in URL) to avoid losing login state. Only launches a new instance when no existing Chrome is detected.

This change has been merged into upstream baoyu-skills ([#23](https://github.com/JimLiu/baoyu-skills/pull/23)) and is now an official feature.

---

### 7. Why are search results sometimes inconsistent?

**Misconception:** "Good prompts guarantee good search results"
**Truth:** "Search quality = AI model × prompt × search scope"

The search strategies in SKILL.md (by topic type: tech/product/social) provide **scope suggestions**, not quality guarantees. Actual results also depend on:

- **AI model capability**: Different models interpret search instructions differently
- **Prompt specificity**: More specific instructions yield more precise results
- **Timeliness**: Hot topics have varying update frequencies

**Suggestion:** Treat search strategies as a starting point. Iterate based on actual results. If one AI's search quality is poor, try a different model.

---

## 🛠️ Modular Commands & Flexibility

This Skill supports **starting from any stage** and **ending at any stage**. No need to run full pipeline every time:

### Common Usage Scenarios

**Scenario 1: Research only, no article**
```
Collect latest news about "AI coding assistants",
organize into a source document, no article needed.
```

**Scenario 2: Already have sources, write directly**
```
Use this notes.md as source material, write a blog article,
show me when done, don't publish.
```

**Scenario 3: Article ready, just publish**
```
Publish ~/Documents/article.md to WeChat drafts.
```

**Scenario 4: Full end-to-end**
```
Write an article about "Cursor vs Windsurf 2025 comparison",
start from source collection, save to WeChat drafts when done.
```

**Scenario 5: No WeChat, just want the research+writing workflow**
```
Research XX topic, analyze core points, write as blog article,
save to ./output/article.md
```

> 💡 **WeChat publishing is just the final optional step**. The core value is: systematic research method + anti-hallucination mechanism + human-sounding writing principles.

## 🚀 Continuous Evolution & Feedback

**This project is actively maintained!**
Welcome to try it out and provide feedback (via Issues or PRs). Your feedback may become input for the next system evolution.

## 🌐 Multi-IDE Compatibility

Core logic (SKILL.md) uses universal Open-Skill specification, all IDEs supported:

- **Claude Code**: ⭐ **Recommended** - CLAUDE.md auto-loads project memory + auto image gen + WeChat publish
- **Antigravity**: ✅ Compatible - Auto-loads SKILL.md + native Gemini image gen (no extra Skills needed)
- **Cursor / Windsurf**: ✅ Compatible - Manually reference SKILL.md, image gen via `baoyu-danger-gemini-web`
- **Other Agentic IDEs**: Depends on toolset; image gen options are all-IDE compatible

### ⚠️ Feature Comparison

| Feature | Claude Code | Antigravity | Cursor etc. |
|---------|-------------|-------------|-------------|
| **Workflow loading** | ✅ CLAUDE.md auto | ✅ SKILL.md auto | ⚠️ Manual |
| Source collection | ✅ Auto | ✅ Auto | ✅ Auto |
| Deep analysis | ✅ Auto | ✅ Auto | ✅ Auto |
| Article writing | ✅ Auto | ✅ Auto | ✅ Auto |
| **Image generation** | ✅ Auto | ✅ Auto | ✅ Auto |
| WeChat publishing | ✅ Auto | ✅ Auto | ⚠️ Config needed |

### 🎨 Image Generation Options

All three options are **compatible with all IDEs**. Choose based on your setup:

**Option 1: `baoyu-danger-gemini-web` Skill (Recommended)**
Auto-generates images via Gemini Web reverse API — no manual steps required. Works with any IDE that supports Skills. Pair with `nano-banana-pro-prompts-recommend-skill` for prompt optimization.

**Option 2: Chrome MCP + Gemini Web UI**
Uses browser automation to operate Gemini in the background via your logged-in session. No manual intervention needed, but generation history will appear in your Gemini chat logs. Works for anyone with a Google account logged into Gemini.

**Option 3: Antigravity Native**
Antigravity has built-in Gemini image generation — no extra Skills needed.

> 💡 Options 1 and 2 work with any Agentic IDE. Option 3 is Antigravity-only.

**Claude Code / Cursor users tip:**

If your IDE doesn't auto-load the workflow, reference it manually:

```
Please read SKILL.md first, then follow Stage 1-2 to search for today's hot topics as article material.
```

> 💡 See [SETUP.md Q7](./docs/SETUP.md#q7-claude-code-不识别-skillmd-工作流) for details

### Author's Setup

> 作者的开发环境，仅供参考，你可以用自己喜欢的工具替代

| Item | Setup |
|------|-------|
| **Hardware** | MacBook Air M4, 16GB RAM |
| **Models** | Claude Opus 4.6 (primary), Gemini Pro 3 (secondary), MiniMax M2.5 (scheduled tasks) |
| **Runtime** | Bun, Docker |
| **API** | [OpenClaw](https://github.com/openclaw/openclaw) subscription |

> Author's setup — yours may differ.

## 🤖 AI Collaboration Statement

This project was built collaboratively by multiple AI Agents and the user:

| Version | Main Contributor | Role |
|---------|------------------|------|
| v1.0 | **Antigravity** | Project inception, 4-stage workflow design |
| v1.5 | **Antigravity** | Expanded to 9-stage workflow |
| v2.0-2.5 | **Antigravity** | Refined to 7 stages, WeChat integration |
| v3.1-3.2 | **Claude Code (Opus 4.5)** | Bug fixes, fallback mechanisms, NotebookLM testing, doc restructuring |
| v4.0 | **Claude Code (Opus 4.5)** | Chrome reuse, all-IDE image gen, upstream PR, doc overhaul |
| v4.1 | **Claude Code (Opus 4.6)** | Multi-agent code review, Cross-Reference Verification (Stage 3.5), confidence self-assessment, 6-dim AI scan, board-register matching |
| v4.2 | **Claude Code (Opus 4.6)** | Source grading framework, MIT license |
| v4.3 | **Claude Code (Opus 4.6)** | Playwright Bilibili extraction (Method 6), next-step hints, WeChat login detection, multi-tab focus fix, duplicate title fix |

> See [CHANGELOG.md](./docs/CHANGELOG.md) for detailed update history

## Author

Built by **小试AI** ([@AliceLJY](https://github.com/AliceLJY)) · WeChat: **我的AI小木屋**

> 医学出身，文化口工作，AI 野路子。公众号六大板块：AI实操手账 · AI踩坑实录 · AI照见众生 · AI冷眼旁观 · AI胡思乱想 · AI视觉笔记

Six content pillars: **Hands-on AI** · **AI Pitfall Diaries** · **AI & Humanity** · **AI Cold Eye** · **AI Musings** · **AI Visual Notes**

Open-source byproducts: [content-alchemy](https://github.com/AliceLJY/content-alchemy) · [openclaw-worker](https://github.com/AliceLJY/openclaw-worker) · [openclaw-cc-pipeline](https://github.com/AliceLJY/openclaw-cc-pipeline) · [openclaw-content-alchemy](https://github.com/AliceLJY/openclaw-content-alchemy) · [digital-clone-skill](https://github.com/AliceLJY/digital-clone-skill)

<img src="./assets/wechat_qr.jpg" width="200" alt="WeChat QR Code">

---
v1.0-2.5 by Antigravity | v3.1-3.2 by Claude Code | v4.0 by Claude Code (Opus 4.5) | v4.1-4.3 by Claude Code (Opus 4.6)
