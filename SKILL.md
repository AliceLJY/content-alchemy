---
name: content-alchemy
description: |
  A 7-stage semi-automated workflow to transform ideas into high-quality digital assets.
  Stages: Topic Mining → Source Extraction → Analysis → Refining → Humanized Article → Distribution (Smart Update) → Cleanup.
trigger:
  - "写.*公众号"
  - "写.*文章"
  - "内容炼金"
  - "alchemy"
  - "话题.*写"
  - "自动生成.*文章"
allowed-tools:
  - All
metadata:
  version: "2.5"
  auto-trigger: true
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
- **Draft Mode**: Start from Stage 6 (If you only need to publish an existing MD).

---

## 📋 Stage-by-Stage Workflow

### Stage 1: Topic Mining ⏸
- **Action**: Multi-channel search (GitHub, YouTube, etc.).
- **Checkpoint**: Present `{topic-slug}/mining-report.md`. **User must approve topics.**

### Stage 2: Source Extraction ⏸
- **Multi-Channel Mining**: Search across videos, articles, GitHub, papers, news.
- **Fallback Logic [MANDATORY]**:
  1. **YouTube-First**: Try `yt-dlp` for automated transcript.
  2. **Bilibili Mirror**: If failed, search Bilibili for transcript or manual summary.
  3. **Web Search**: If no video found, use `search_web` for deep articles, whitepapers, or transcripts.
  4. **AI Knowledge Base**: Last resort. Label as "Level 4: AI Internal Knowledge".
- **Checkpoint**: Present **Source Authenticity Report**. **User must verify sources.**

**Source Authenticity Table Format:**
| Source | Type | Level | Fact Status | Method |
| :--- | :--- | :--- | :--- | :--- |
| [URL/Title] | Video | 1 | Verified | yt-dlp |
| [Title] | Blog | 2 | Verified | browser_subagent |
| [Title] | Social | 3 | Speculative | search_web |
| Internal | AI | 4 | Generative | AI Memory |

- **Levels Explanation**:
  - **Level 1**: Primary Source (Transcript/Official Paper).
  - **Level 2**: Secondary Source (Expert blog/Detailed news).
  - **Level 3**: Tertiary Source (Social media/Discussions).
  - **Level 4**: AI Hallucination/Knowledge base (No specific source found).


1. **视频内容** (YouTube/Bilibili)
   - 优先 YouTube（自动字幕可用）
   - Bilibili 作为补充（需检查字幕）
   - 使用 `yt-dlp` 提取字幕

2. **技术文章/博客**
   - Medium, Dev.to, 个人博客
   - 技术社区（掘金、思否）

3. **开源项目** (GitHub)
   - README, Issues, Discussions
   - Release Notes, Documentation

4. **学术论文** (arXiv, Google Scholar)
   - 最新研究成果
   - 引用关键发现

5. **新闻/报道**
   - 科技媒体（TechCrunch, The Verge）
   - 行业报告

### 🎯 视频采集：YouTube-First 策略

**仅适用于视频素材采集时**

**问题：** Bilibili 视频常无字幕 API
**方案：** 优先搜索 YouTube 镜像内容

**工作流：**
1. 搜索 Bilibili 原始内容
2. 如字幕不可用：
   - 搜索 YouTube：`{video_title} site:youtube.com`
   - 使用 `yt-dlp` 提取字幕
   - 标记来源："YouTube Mirror of [Bilibili URL]"
3. 验证字幕质量后进入分析

**示例：**
```bash
# B站视频: BV1xx411c7mD (无字幕)
# YouTube 搜索: "Llama 4 发布会 site:youtube.com"
# 找到: youtube.com/watch?v=xxxxx (有自动字幕)
# 提取: yt-dlp --write-auto-sub --skip-download [URL]
```

💡 **这不是审查绕过，而是数据可得性优先**

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

### Stage 5: Humanized Article (人性化写作) - WeChat-Ready Content ⏸

- **Goal**: Transform research paper into engaging, human-sounding article.
- **Style**: Follow the 7 Principles (Restrained intro, less evaluation, bold questions, etc.)
- **Auto-Formatting** [CRITICAL]:
  1. Run `format-text.ts` to fix spaces/punctuation.
  2. **Chinese Punctuation Check** [MANDATORY]:
     - Replace ALL English punctuation with Chinese equivalents.
     - ❌ Forbidden: . , ! ? : ; " " ' ' ( )
     - ✅ Required: 。，！？：；“”‘’（）
     - Exception: Code blocks, URLs, English sentences only.
  3. Apply humanizer-zh rules (remove AI patterns).
- **Rules**:
  1. **Punctuation**: 100% full-width Chinese style (`，` `。` `！`).
  2. **Cover**: Insert as the first element.
  3. **Signature**: Append: `本文由 [Content Alchemy](https://github.com/AliceLJY/content-alchemy) 自动生成。`
- **Visuals**: Auto-generate cover (2.5:1) and internal illustrations without asking.
- **Checkpoint**: Present `{topic-slug}/article.md`. **User must approve the article.**

### 🛡️ Why Manual Cover & Formatting?
**Problem**: Automated cover setting often fails due to WeChat's UI changes or hover-only buttons.
**Solution**: AI generates assets and saves them to `Desktop/wechat_assets/`. User manually selects the first image as the cover of the draft. This is the only 100% stable approach.

### 🖼️ Cover & Asset Strategy (Execution Rules)
1. **Asset Sync**: Every image must exist in `{topic-slug}/` AND `Desktop/wechat_assets/`.
2. **Pre-flight Check**: Before navigating to WeChat, verify all images in Markdown have valid absolute paths.
3. **Image-First Upload**: (For Automation) Prioritize uploading images to the WeChat library via CDP, getting back the `wx_fmt` URL, and replacing the local path in Markdown *before* pasting the body.

### Stage 6: Distribution (Flash-Publish Mode) ⏸
- **Boundary**: Automation to "Saved Draft".
- **Prerequisite**: Chrome Debug Port 9222.
- **Execution Protocol [FORCE]**:
  1. **Window Lock**: Search for active `mp.weixin.qq.com` tab. Activate it. Do NOT open new windows unless none exist.
  2. **Title-Body Atomic Injection**: Use a single script heartbeat to inject both Title and Body. No more split copy-paste.
  3. **Immediate Recovery**: If the editor fails to load or formatting breaks, immediately redirect to: `https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=77`.
  4. **Timeout Logic**: If any automation step hangs >30s, refresh and retry "New Post".

### 🌐 Why Chrome Debug Port (9222)?
**CDP Mode vs. API Mode**:
- **CDP Mode (Required)**: Pure browser automation. Mimics human clicks. HIGH stability.
- **API Mode (Fallback)**: Direct HTTP requests. Often triggers 429 (Rate Limit) or "Security Check" errors.
**Instruction**: Never proceed with the Baoyu script unless port 9222 is confirmed open. API mode is a "fake success" trap.

### Stage 7: Cleanup (清理)

- **Action**: Remove temporary files and working directories.
- **Rule**: Keep the final output in `output/` and `manifesto.md`, but delete temporary search results and redundant mirrored assets if confirmed by user.

---

## 🛠️ Commands
- `alchemy [topic]`: Full flow.
- `alchemy-setup`: Dependencies download.
- `publish`: Run Stage 6 only (Includes "Image-First" path conversion).

## 📦 Installation

### Step 1: Copy to skills directory
```bash
mkdir -p ~/.agent/skills/content-alchemy
cp -r /Users/anxianjingya/content-alchemy-repo/* \
      ~/.agent/skills/content-alchemy/
```

### Step 2: Verify installation
```bash
ls ~/.agent/skills/content-alchemy/SKILL.md
# Should show the file exists
```

### Step 3: Test trigger
Ask Antigravity: "帮我写个公众号文章，话题是XXX"
Should automatically invoke this skill.

## 💻 Verified Environment & Hardware
*(Verified by @AliceLJY)*

- **Model**: MacBook Air (13-inch, M4, 2025)
- **Chip**: Apple M4 (16 GB Memory)
- **OS**: macOS Tahoe (Version 26.3 Beta)
- **IDE**: Antigravity (Powered by Google Gemini)
