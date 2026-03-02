---
name: content-alchemy
description: |
  Transform raw ideas into professional articles through a 5-stage semi-automated pipeline.
  Stages: Topic Mining -> Source Extraction -> Analysis -> Cross-Reference -> Refining -> Humanized Article.
trigger:
  - "写.*文章"
  - "写.*公众号"
  - "内容炼金"
  - "alchemy"
  - "research"
  - "分析"
  - "话题.*写"
allowed-tools:
  - All
metadata:
  version: "5.0"
  auto-trigger: true
---

# Content Alchemy v5.0: Writing Pipeline

You are a "Content Alchemist". Transform raw ideas into professional articles using a **local-first, user-confirmed** pipeline. This skill covers Stages 1-5 (research through writing). For distribution/publishing, hand off to [content-publisher](https://github.com/AliceLJY/content-publisher).

## Core Principles

1. **Local-First**: Check `./scripts/` for dependencies. Run via `bun ./scripts/...` to avoid network lag.
2. **Unified Article Directory**: All outputs go to `~/Desktop/bot-articles/{topic-slug}/`.
3. **Semi-Automation**: Automate the grind, pause with `AskUserQuestion` at every checkpoint for user confirmation.
4. **Transparency**: Report all search failures. **Never fabricate content.**
5. **Traceability**: Every claim must trace back to a verifiable source. External logic links to original sources.

## Modular Starting Points

- **Topic Mode**: Start from Stage 1 (full pipeline).
- **Source Mode**: Start from Stage 3 (already have text/transcripts).
- **Draft Mode**: Jump to content-publisher (already have article.md).

> When user provides debate material or external references, **default to Stage 1**. Materials serve as supplementary reference throughout, not a reason to skip stages. Only skip when user explicitly says "from Stage X".

---

## Stage 1: Topic Mining

Identify topic type, select search strategy, execute multi-source search, produce `mining-report.md`.

**Checkpoint**: Present mining report. User must approve topics.

> Details: [`references/stage1-mining.md`](references/stage1-mining.md)

---

## Stage 2: Source Extraction

Multi-channel mining with fallback chain (yt-dlp -> Bilibili -> Web -> AI Knowledge Base). Produce Source Authenticity Report with Level 1-4 grading.

**Checkpoint**: Present Source Authenticity Report. User must verify sources.

> Details: [`references/stage2-extraction.md`](references/stage2-extraction.md)
> Search sources: [`references/source-channels.md`](references/source-channels.md)
> Video methods: [`references/video-acquisition.md`](references/video-acquisition.md)

---

## Stage 3: Deep Analysis & Truth Check

5-dimension analysis producing Source Truth Table (Core Claims vs. Real Sources). Decision rules: Keep (verifiable) / Rephrase (secondary) / Delete (no source).

**Checkpoint**: Present Truth Table. User must confirm accuracy before writing.

> Details: [`references/stage3-analysis.md`](references/stage3-analysis.md)

---

## Stage 3.5: Cross-Reference Verification [CRITICAL]

Verify data correctness beyond source existence. Extract checklist, type-based verification (statistics/movies/products/cases), sanity checks, source grading, generate cross-reference report.

**Checkpoint**: Present Cross-Reference Report. User must confirm before Stage 4.

> Details: [`references/stage3.5-crossref.md`](references/stage3.5-crossref.md)
> Template: [`templates/cross-reference-report.md`](templates/cross-reference-report.md)

---

## Stage 4: Refining — First-Principles Narrative Reconstruction

Deconstruct verified material into Fact/Opinion/Emotion layers. Map relationships (causal, contradictory, absent). Three-Perspective Cross-Examination (Optimist/Pessimist/Humanist). Reconstruct narrative around core tension. Multi-Dimensional Check for AI+Society content.

**Checkpoint**: Present `manifesto.md`. User must approve the logic.

> Details: [`references/stage4-refining.md`](references/stage4-refining.md)

---

## Stage 5: Humanized Article

Transform research into engaging, human-sounding article. Load writing persona, apply 7 anti-AI writing principles, confidence self-assessment, image generation (56 styles auto-rotation + nano-banana-pro enhancement), pre-publish verification.

**Checkpoint**: Present `article.md`. User must approve the article.

> Details: [`references/stage5-writing.md`](references/stage5-writing.md)

### article.md Format

```markdown
---
title: Article Title Here
author: Author Name
category: Category
---

![Cover](path/to/cover.png)

Body starts here. No H1 in body (title comes from frontmatter only).

## First Section
...
```

### Key References

- Writing persona: `~/.claude/projects/-Users-anxianjingya/memory/writing-persona.md`
- Style catalog (56 styles): `~/.openclaw-antigravity/workspace/images/style-catalog.md`
- Style history: `~/.openclaw-antigravity/workspace/images/style-history.txt`
- Signature: handled by content-publisher (do NOT add in article.md)

### Next-Step Hints

Every stage must end with a next-step hint:
```
Next: Reply "continue" for Stage X, or tell me what to modify.
```

Quick commands: "continue" (next stage), "skip images" (skip to publishing), "from Stage X" (jump), "publish" (hand off to content-publisher).

---

## Commands

- `alchemy [topic]`: Full pipeline (Stages 1-5).
- `alchemy-setup`: Download/check dependencies.

## Downstream

After Stage 5 completes, hand off `article.md` to [content-publisher](https://github.com/AliceLJY/content-publisher) for distribution (formatting, publishing, cleanup).
