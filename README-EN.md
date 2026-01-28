# Content Alchemy Skill

English | **[中文](./README.md)**

🚀 **Getting Started**: [Setup Guide](./docs/SETUP.md) | [Beginner Guide](./docs/BEGINNER-GUIDE.md) | [WeChat Publishing](./docs/WECHAT-PUBLISH.md)
📚 **Deep Dive**: [Technical Docs](./SKILL.md) | [Project Structure](./docs/PROJECT-STRUCTURE.md)
🔄 **Quick Update**: `git pull && git submodule update --remote --merge`

**One-liner**: Let AI handle any or all stages of your content pipeline — Research → Analysis → Writing → Illustration → Publishing.

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
- 🛡️ **Anti-hallucination** — Source Truth Table forces citation of sources
- ✨ **Human-sounding** — 7 writing principles to eliminate AI-speak
- 📖 **Beginner-friendly** — Verification steps at every stage, no coding required

---

## 💡 Why This Project Is Different

> Not "just another template" — this is **battle-tested wisdom from countless pitfalls**.

**v4.0 Highlights (for serious users):**

| Problem You Might Face | Already Solved |
|------------------------|----------------|
| 🤔 "Must close Chrome every time to publish" | Chrome reuse: auto-detects existing browser, no more closing windows |
| 🤔 "Only Antigravity can auto-generate images" | All-IDE illustration: 3 options all IDE-compatible — Gemini Web reverse API / Chrome MCP / Antigravity native |
| 🤔 "Setup takes forever and still doesn't work" | Complete `doctor.sh` environment check, one-click diagnostics |
| 🤔 "AI writing sounds robotic" | 7 de-AI principles + Humanizer checklist |
| 🤔 "Don't know where to find sources" | Search strategies by topic type (tech/product/social) |
| 🤔 "AI makes up data" | Source Truth Table forces citations, eliminates hallucination |
| 🤔 "This is your style, how do I adapt?" | Clear separation of **universal framework** vs **personal examples** |
| 🤔 "Where does Baoyu go? How to install?" | Lazy install: just paste a link to AI and ask it to install |
| 🤔 "How to extract YouTube subtitles?" | yt-dlp + NotebookLM dual approach |

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

- ✅ Auto-fill title, paste content, insert images, save draft
- ✅ Runs locally, no third-party servers
- ✅ Time saved: 13 min → 3.5 min

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
bun ./dependencies/baoyu-skills/skills/baoyu-post-to-wechat/scripts/wechat-article.ts --help
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

### 5. Why no need to close Chrome anymore?

**Misconception:** "You must close all browser windows to publish"
**Truth:** "That was an old limitation, fixed in v4.0"

**Pitfall:**
Every time you published to WeChat, you had to Cmd+Q all Chrome windows. Otherwise the script would fail due to profile directory lock conflict.

**v4.0 fix:**
Script auto-scans for existing Chrome debug ports before launch. If found, it reuses the existing browser. It prioritizes tabs already logged into WeChat (identified by `token=` in URL) to avoid losing login state. Only launches a new instance when no existing Chrome is detected.

This change has been merged into upstream baoyu-skills ([#23](https://github.com/JimLiu/baoyu-skills/pull/23)) and is now an official feature.

---

### 6. Why are search results sometimes inconsistent?

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

### 💻 Verified Environment

This project has been fully tested on (Stable):

- **Hardware**: MacBook Air (13-inch, M4, 2025) / 16GB RAM / Apple M4 Chip
- **System**: macOS Tahoe (26.3 Beta)
- **IDE**:
  - **Claude Code (Opus 4.5)** — Primary dev environment, coding & debugging
  - **Antigravity (Gemini)** — Test environment, multi-platform compatibility testing

## 🤖 AI Collaboration Statement

This project was built collaboratively by multiple AI Agents and the user:

| Version | Main Contributor | Role |
|---------|------------------|------|
| v1.0 | **Antigravity** | Project inception, 4-stage workflow design |
| v1.5 | **Antigravity** | Expanded to 9-stage workflow |
| v2.0-2.5 | **Antigravity** | Refined to 7 stages, WeChat integration |
| v3.1-3.2 | **Claude Code (Opus 4.5)** | Bug fixes, fallback mechanisms, NotebookLM testing, doc restructuring |
| v4.0 | **Claude Code (Opus 4.5)** | Chrome reuse, all-IDE image gen, upstream PR, doc overhaul |

> See [CHANGELOG.md](./docs/CHANGELOG.md) for detailed update history

## 📲 Follow the Author

Professional cross-domain acrobat: 🧬 Medical background, 🎭 Culture sector day job, 🤖 AI is my side quest.

Not chasing parameters or new models. Only one question matters: When can AI plug into my brain and feel unhappy for me?

Welcome to witness my love-hate relationship with AI.

— AI won't replace you, but people who use AI will. So I learned first. No pressure.

🔧 Pitfall byproducts open-sourced → [content-alchemy](https://github.com/AliceLJY/content-alchemy)

<img src="./assets/wechat_qr.jpg" width="200" alt="WeChat QR Code">

---
*v1.0-2.5 by Antigravity | v3.1-3.2 by Claude Code | v4.0 by Claude Code (Opus 4.5)*
