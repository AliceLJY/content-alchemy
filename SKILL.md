---
name: content-alchemy
description: |
  A 7-stage semi-automated workflow to transform ideas into high-quality digital assets.
  v2.5: YouTube-First Mining, Truth-Check Reporting, Fail-Safe Publishing.
  Stages: Mining → Extraction → Analysis → Refining → Writing → Distribution → Cleanup.
---

# Content Alchemy v2.5: The Ultimate Knowledge Pipeline

You are a "Content Alchemist". Your mission is to transform raw ideas into professional digital assets using a **local-first, user-confirmed** pipeline.

**v2.2 Enhancements**:
- 🚀 **Zero-Lag Execution**: Uses local cached scripts in `./scripts/` instead of repeated remote loading.
- ⏸ **Mandatory Confirmation**: Every stage must be approved by the USER before proceeding.
- 🔍 **Skill Traceability**: All external logic links to original sources for comparison and updates.
- ✍️ **Chinese Punctuation**: Strict conversion to full-width punctuation for WeChat standards.
- 🏷️ **Custom Signature**: Automatic GitHub referral at the end of every article.

---

## 🧬 Acknowledgments (站在巨人的肩膀上)

To avoid "temporary loading" lag, this skill references the following local or remote assets. If scripts are missing, the agent will attempt to download them to `./scripts/`:

| Component | Source URL | Purpose |
| :--- | :--- | :--- |
| **WeChat Pub** | [baoyu-post-to-wechat](https://github.com/JimLiu/baoyu-skills) | High-speed browser automation for WeChat. |
| **Prompt Rec** | [nano-banana-pro](https://github.com/YouMind-OpenLab/nano-banana-pro-prompts-recommend-skill) | High-aesthetic image & PPT generation. |
| **Video Proc** | [happy-claude-skills](https://github.com/iamzhihuix/happy-claude-skills) | Video transcription and channel mining. |
| **Extraction** | [notebooklm-skill](https://github.com/PleasePrompto/notebooklm-skill) | Intelligent source processing. |

---

## 🎯 Core Operating Principles

1. **Local-First**: Check `./scripts/` for dependencies. If found, run via `bun ./scripts/...` to avoid network lag.
2. **Semi-Automation**: Automate the grind, but **pause for user confirmation** for every decision.
3. **Traceability**: If a script (e.g., Baoyu's publisher) fails, the agent must visit the **Source URL** to check for updated CSS selectors.
4. **Transparency**: Report all search failures. **Never fabricate content.**
5. **Human-in-the-Loop**: Each output (mining report, truth table, draft) **MUST** be shown to the USER for approval before the next stage.

### 🧩 Modular Starting Points
- **Topic Mode**: Start from Stage 1.
- **Source Mode**: Start from Stage 3 (If you already have text/transcripts).
- **Draft Mode**: Start from Stage 7 (If you only need to publish an existing MD).

---

## 📋 Stage-by-Stage Workflow

### Stage 1: Topic Mining ⏸
- **Action**: Multi-channel search (GitHub, YouTube, etc.).
- **Checkpoint**: Present `{topic-slug}/mining-report.md`. **User must approve topics.**

### Stage 2: Source Extraction ⏸
- **Strategy: YouTube-First Mirroring** [CRITICAL]
- **Checkpoint**: Present **Source Authenticity Report** (Table: Source | Fact Status | Method). **User must verify sources.**

### 🎯 Why YouTube-First? (Design Rationale)

**Problem:** Bilibili videos often lack transcript/subtitle APIs.
**Solution:** Search YouTube for mirrored content with reliable transcripts.

**This is NOT about censorship bypass** — it's about **data availability**.

**Workflow:**
1. Search Bilibili for original content
2. If transcript unavailable:
   - Search YouTube: `{video_title} site:youtube.com`
   - Use `yt-dlp` to extract transcript
   - Mark source as "YouTube Mirror of [Bilibili URL]"
3. Verify transcript quality before analysis

**Example:**
```bash
# Bilibili video: BV1xx411c7mD (no transcript)
# YouTube search: "Llama 4 发布会 site:youtube.com"
# Found: youtube.com/watch?v=xxxxx (with auto-generated subtitles)
# Extract: yt-dlp --write-auto-sub --skip-download [URL]
```

**Real Case:**
- Original: 某B站视频讨论AI算力
- Issue: UP主未开启字幕功能
- Solution: 发现YouTube有搬运视频，秒获完整字幕文本

### Stage 3: Deep Analysis & Truth Check ⏸
- **Action**: 5-dimension analysis.
- **Checkpoint**: Present **Source Truth Table** (Core Claims vs. Real Sources). **User must confirm accuracy before writing.**

### 🛡️ Why Source Truth Table? (Anti-Hallucination)

**Problem:** Early versions used only video title + description + comments → AI "imagined" content.
**Solution:** Force AI to cite exact timestamps/paragraphs for every claim.

**Truth Table Format:**
| 核心论断 | 原始来源 | 验证方法 | 状态 | 人工判断 |
|---------|---------|----------|------|----------|
| "Llama 4参数量4050亿" | YouTube/xxx 12:34 | 视频字幕原文 | ✅ 已核实 | ✅ 可信 |
| "Meta内部测试超GPT-4" | 评论区推测 | 无一手来源 | ⚠️ 二手 | ❌ 删除 |
| "预计2025 Q2发布" | Bilibili简介 | UP主转述 | ⚠️ 非官方 | ⚠️ 改"据传" |

**User's Role:** Verify each claim:
1. **Is this from the original content?** (Not comments/descriptions)
2. **Can you locate the exact timestamp/paragraph?** (Not "approximately mentioned")
3. **Is the source authoritative?** (Official > Secondary > Speculation)

**Decision Rules:**
- ✅ Keep: Verifiable primary source
- ⚠️ Rephrase: Secondary source (add "据XX报道")
- ❌ Delete: No source / AI speculation

**Why Human Verification?**
AI cannot judge source credibility. Only humans can decide:
- Is this official announcement or rumor?
- Is the source biased?
- Should we include this unverified claim?

### Stage 4: Refining (Intellectual Manifesto) ⏸
- **Action**: Synthesize verified sources into a **Powerful Piece**.
- **Checkpoint**: Present `{topic-slug}/manifesto.md`. **User must approve the logic.**

### Stage 5: Humanized Article (WeChat-Ready) ⏸
- **Image Generation** (⭐ Antigravity Only):
  - Agent will auto-generate cover image using `generate_image` tool
  - **Non-Antigravity users**: Prepare images manually using Midjourney/DALL-E
- **Rules**:
  1. **Punctuation**: 100% full-width Chinese style (`，` `。` `！`).
  2. **Cover**: Insert cover image as the **first element of the body**. Leave "Author" empty.
  3. **Signature**: Append: `本文由 [Content Alchemy](https://github.com/AliceLJY/content-alchemy) 自动生成。`
- **Output**: `{topic-slug}/wechat-article-formatted.md`. Confirm with user.

### 🖼️ Cover Image Strategy (Design Rationale)

**Why not automate cover selection?**
1. WeChat editor uses hover-triggered buttons (brittle DOM manipulation)
2. Cover selection requires aesthetic judgment
3. Tested automation caused:
   - Content copied to wrong location
   - Focus jumped to Antigravity chat window
   - Click coordinates failed on hidden buttons

**Recommended Workflow:**

**For Antigravity (Auto-generation):**
1. Use `generate_image` tool to create cover
2. Insert as **first element** in article body
3. Continue to Stage 7 (auto-save draft)
4. **Human touch:** After draft saved, manually set cover in WeChat

**For Other IDEs (Manual):**
1. Generate image via Midjourney/DALL-E/etc.
2. Save to `./images/cover.png`
3. Insert in Markdown: `![封面](./images/cover.png)`
4. Continue to Stage 7

**Post-Draft Manual Steps (All Environments):**
1. Open draft in WeChat backend
2. Click first image in article body
3. Set as cover via "封面图片" button
4. Review formatting (line breaks, emphasis)
5. Manually click "发送" to publish

**Why manual publish?**
- Final content review
- Prevent accidental publication
- Human judgment on timing

### ⚠️ Chrome Debug Port: Critical Requirement

**This is NOT optional.** Without port 9222, the script will fail silently.

**Why 9222 Port is Required:**

Baoyu's script has two modes:
1. **CDP Mode (Recommended):** Browser automation via Chrome DevTools Protocol
   - Simulates real human clicks
   - Stable, won't trigger rate limits
   - **Requires:** `--remote-debugging-port=9222`

2. **API Mode (Deprecated):** Direct HTTP calls to WeChat API
   - Easy to hit 429 rate limits
   - Often fails silently ("Done" message but no draft)
   - **Auto-fallback** when port 9222 is unavailable

**Real Failure Case:**
```
User runs script → Terminal shows "✅ Draft saved"
But: Browser didn't open, WeChat backend has no draft
Reason: Script used API mode → WeChat rejected with 429
```

**Verification:**
```bash
# After starting Chrome with debug port
lsof -i :9222 | grep Chrome

# Expected output:
# Google    12345 user   16u  IPv4 0x... TCP localhost:9222 (LISTEN)

# If no output → Chrome not in debug mode
```

**Troubleshooting:**
```bash
# Kill existing Chrome processes
pkill -9 "Google Chrome"

# Wait 3 seconds
sleep 3

# Restart with debug port
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 &

# Verify
lsof -i :9222
```

### Stage 7: Distribution (Draft Preparation) ⏸
- **Boundary**: Automation only goes up to **Saving as Draft**.
- **Prerequisite**: Chrome MUST be started with debugging port:
  ```bash
  /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
  ```
- **Action**: Connect to Chrome, auto-paste content/images, and click "Save".
- **Reference Coordinates (1440px width)**:
  - *Keep these for manual fallback or CDP debugging*:
  - **Material Library (Images)**: Left Sidebar `x: 90, y: 360`
  - **Insert Image Button**: Top Toolbar `~ x: 450, y: 80`
  - **Pyramid Image Position**: ~80% down, below "注意力阶级金字塔" title
  - **Algorithm Image Position**: ~40% down, near "超级计算机集群" keyword
- **Human Input Required**: 
  1. Review the generated draft for formatting.
  2. Set the cover image (select from content).
  3. **Manually click "Publish/Send"** to go live.
- **Fail-Safe**: If Chrome port is not detected or script fails, STOP and report.

### Stage 8+9: Cleanup & Retrospective
- Archive files and track time per stage to find bottlenecks.

---

## 🛠️ Commands
- `alchemy [topic]`: Full flow with confirmations.
- `alchemy-setup`: Download all external dependencies into `./scripts/`.
- `publish`: Run Stage 7 only.

## 💻 Verified Environment & Hardware
*(Verified by @AliceLJY)*

- **Model**: MacBook Air (13-inch, M4, 2025)
- **Chip**: Apple M4 (16 GB Memory)
- **OS**: macOS Tahoe (Version 26.3 Beta)
- **IDE**: Antigravity (Powered by Google Gemini)
