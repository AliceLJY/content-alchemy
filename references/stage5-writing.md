# Stage 5: Humanized Article -- WeChat-Ready Content

> Read this when entering Stage 5. This is the largest reference file, covering writing persona loading, article format, confidence self-assessment, 7 anti-AI writing principles, humanizer checklist, 6-dimension AI scan, section-style matching, opening 4-question check, 3-layer method, anti-formula, style iteration, auto-formatting, image generation, pre-publish verification, and WeChat pitfalls.

---

## Step 5.0: Load Writing Style Anchor [MANDATORY -- before any writing]

> Principle: De-AI-ing prompts treat symptoms; style anchors treat root cause.

**Read `writing-persona.md`'s Quick Calibration block** before writing:

1. Find and read `writing-persona.md` from `~/.claude/projects/*/memory/` (auto-detect active project)
2. **Only the `## Quick Calibration` YAML block** is needed for calibration:
   - `voice_profile`: 5-dimension voice coordinates (formal_casual / serious_playful / technical_simple / reserved_expressive / humble_confident)
   - `core_fingerprints`: 6 core fingerprints (question-first, nested clauses, cross-domain metaphors, hypothetical-open-endings, long-short alternation, lateral comparison)
   - `criticism_method`: 3-step criticism packaging
   - `must_have / must_not / banned_words`: calibration traffic lights
3. **Need example sentences or deeper understanding?** Read further sections (language fingerprints / opinion expression / structural preferences)
4. If `writing-persona.md` has a "revision iteration log" at bottom, **prioritize latest iteration rules** (extracted from actual edits, more accurate than general principles)
5. **Style anchor > 7 principles**: When persona rules conflict with the 7 general principles below, persona wins

---

## article.md Format Spec [MANDATORY]

> Title must not appear twice: frontmatter has `title:`, do NOT add `# Title` in body.
> The publishing script extracts title from frontmatter for WeChat title bar but does not remove H1 from body.
> Both present = title appears twice in WeChat draft.

```markdown
---
title: Article Title Here
author: Author Name
category: Category Name
---

![Cover description](path/to/cover.png)

Body starts here. No H1. Use H2 and below for sections.

## First Section

Content...
```

**Key rules**:
- frontmatter `title:` -- the ONLY title source
- `# H1` in body -- **FORBIDDEN**, causes title duplication
- `## H2` and below in body -- normal use as section headings

---

## Confidence Self-Assessment [MANDATORY]

> For every factual claim written into the article, do an internal assessment. When uncertain, downgrade. Don't gamble.

| Confidence | Condition | Treatment |
|-----------|-----------|-----------|
| High (>90%) | Multiple training data hits + authoritative source + Stage 3.5 verified | Use directly |
| Credible (insider) | Reliable industry insider first-hand info | Mark "according to industry insiders", don't expose source, don't fabricate numbers |
| Medium (50-90%) | Fuzzy memory / sources differ / time-sensitive | Add qualifiers: "according to XX data", "approximately", "as of 20XX" |
| Low (<50%) | Unsure of specific numbers / possible concept confusion / pure speculation | **Downgrade**: use qualitative instead of quantitative ("a large number" instead of "XX million"), or delete |
| Unknown | No relevant training data | **Label** [needs verification] or delete |

**Key rules**:
- Better to say "uncertain" than fabricate precise data
- **Movie/TV plots, dialogue**: Unless 100% certain, label as low confidence, keep only core premise description
- **Multi-year-old statistics**: Always add year label
- **Low-confidence data must never masquerade as certain fact** -- "honesty beats sensationalism"
- **Inferences must show reasoning chain**: Can't just drop conclusions (e.g., "trade secret so not public"), must lay out "why this makes sense" so readers can follow
- **Hypothetical data must be declared**: Any self-constructed calculation examples (e.g., break-even analysis) must be prefaced with "the following are hypothetical numbers for illustration only"

**Downgrade examples (Chinese context)**:
- ~~"600,000 overwork deaths per year"~~ -> "According to the China Cardiovascular Health Report, approximately 544,000 sudden cardiac deaths occur annually"
- ~~"Huawei watch can detect AFib"~~ -> "Some Huawei mid-to-high-end watches (e.g., Watch GT4) have NMPA certification for AFib risk screening"
- ~~"ICU 14 days cost 2.34M yuan"~~ -> "There have been media reports of extreme ICU cases costing millions"
- ~~"Global #1"~~ -> "China is among the more affected countries"

---

## 7 Anti-AI Writing Principles

### Principle 1: Restrained Opening -- No "Grand Narratives"

Forbidden:
- "In this era of information explosion..."
- "With the rapid development of AI technology..."
- "As we all know..." / "Without a doubt..."

Recommended:
- Jump into a scene: "3 AM. I'm staring at the error message."
- Start with a detail: "I noticed something strange --"
- Open with a question: "Ever feel exhausted despite doing nothing?"

### Principle 2: Show, Don't Evaluate -- Let Readers Conclude

Forbidden:
- "This method is very effective"
- "An brilliant solution"
- "Impressive" / "Crucial" / "Indispensable"

Recommended:
- Use data: "From 4 hours down to 30 minutes"
- Use contrast: Show before/after, let the difference speak
- Use detail: Describe what happened, don't summarize "it was great"

### Principle 3: Ask Boldly -- Create Cognitive Gaps

- Insert genuine confusion between paragraphs: "But this raises a question --"
- Rhetorical questions to guide thinking: "But is that really the case?"
- Admit uncertainty: "Honestly, I'm not sure of the answer either."

### Principle 4: Conversational Transitions -- Talk, Don't Lecture

Delete these mechanical connectors:
- "First... Second... Finally..."
- "In summary" / "Therefore" / "It's easy to see"
- "It's worth noting that"

Replace with:
- "Put simply" / "In other words"
- "It's like..." / "Think of it this way"
- "I later realized" / "And then?"
- "The interesting part is" / "The weird thing is"

### Principle 5: Concrete Over Abstract -- No Empty Adjectives

Forbidden:
- "Improve efficiency" / "Optimize process" / "Empower"
- "Powerful" / "Significant" / "Outstanding"
- "Deep" / "Comprehensive" / "Systematic"

Recommended:
- Quantify: "Eliminated 3 manual steps"
- Concretize: "No more copy-pasting 20 times"
- Metaphor: "Like putting the code on automatic transmission"

### Principle 6: Keep the Human Touch -- Allow Imperfection

Acceptable:
- Casual expressions and particles ("hmm", "well", "right")
- Self-deprecation and humor ("I was such an idiot")
- Thought jumps ("Digressing, back to the point")
- Unresolved confusion ("I still haven't figured this out")
- Personal preferences and positions ("I personally prefer...")

### Principle 7: Light Endings -- No Forced Elevation

Forbidden:
- "Let's wait and see"
- "Hope this article was helpful"
- "In conclusion, XXX is a very valuable tool"
- Forced elevation to "historical significance" / "industry trend"

Recommended:
- Leave an open question
- Return to the opening detail
- End softly, like the silence after a conversation
- Or just don't summarize. Story's done.

---

## Humanizer-ZH Checklist

After writing, check each item and delete/replace:

### Opening Templates -- Delete Immediately
- [ ] "In the context of today's..."
- [ ] "With the continuous development of..."
- [ ] "In recent years..."
- [ ] "As we all know" / "Undeniably"

### Over-Evaluation -- Replace with Specifics
- [ ] "Very important" -> explain WHY it's important
- [ ] "Surprising" -> describe your REACTION when surprised
- [ ] "Powerful features" -> NAME the specific feature

### Mechanical Connectors -- Replace with Conversational
- [ ] "First/Second/Finally" -> break up structure, natural flow
- [ ] "Therefore/So" -> "And then" / "Turned out"
- [ ] "However/But" (consecutive) -> merge or delete

### Empty Summaries -- Delete
- [ ] "In summary" / "To conclude"
- [ ] "Hope this helps"
- [ ] "Let's look forward to..."

### AI High-Frequency Words -- Replace or Delete
- [ ] "Empower" / "Boost" / "Enhance"
- [ ] "Pain point" / "Leverage" / "Closed loop"
- [ ] "Deep" / "Comprehensive" / "Systematic"
- [ ] "Aimed at" / "Dedicated to" / "Focused on"

### Emotion Injection Check
- [ ] Is there at least one genuine emotion? (confusion / frustration / surprise / relief)
- [ ] Is there a concrete scene or image?
- [ ] Does it read like a person talking, or a report?

---

## 6-Dimension AI Flavor Scan

> Run after the Humanizer-ZH checklist. The checklist catches "specific words"; this scan catches "overall patterns".

| Dimension | AI Pattern | Check Method |
|-----------|-----------|-------------|
| **1. Structural uniformity** | Every paragraph similar length, subheadings neatly uniform | Are there single-sentence paragraphs and 6+ sentence long paragraphs mixed? Is paragraph length random? |
| **2. Sentence monotony** | All medium-length sentences, predictable patterns | Are there sub-5-word short sentences and 25+ word long sentences mixed? Any fragment sentences? |
| **3. Vocabulary repetition** | Same phrases/patterns repeat | Ctrl+F the whole text. Same expression 3+ times = need replacement |
| **4. Emotional flatness** | Same tone throughout, no emotional arc | Does the text have self-deprecation, complaints, exclamations, rhetorical questions, hesitation? |
| **5. Meta-commentary density** | "It's worth noting that" / "It should be pointed out that" too frequent | Delete all of these. Let opinions show directly without preamble |
| **6. Predictability** | Reader can guess next sentence/paragraph | Any unexpected expressions, metaphors, or twists? |

**Fix techniques**:
- Structure: At least one single-sentence paragraph + one 6+ sentence paragraph
- Sentences: Mix casual fragments and complex long sentences
- Inject surprise: Where readers expect "elevation", hit them with a twist or self-deprecation

---

## Section-Style Matching

> Different sections need different anti-AI intensity. Tech articles keep terminology precise; humanities allow more subjective expression.

| Section | Style Mode | Anti-AI Focus |
|---------|-----------|--------------|
| **Tech Hands-On** | Technical casual | Only de-AI the style layer, keep terminology and step precision, conversational explanation |
| **Tech Debugging** | Strong casual | Maximum de-AI. Strong subjectivity, emotional ups and downs, first person, sensory details |
| **AI Meets Humanity** | Essay mode | Allow uncertainty ("perhaps" / "maybe"), layered positions, blank space > filling |
| **AI Cold Observer** | Commentary mode | Cool and objective, attitude without sentimentality, present facts let readers judge |
| **AI Random Thoughts** | Brain-dump mode | Allow jumps, allow no answers, can use AI first person, philosophical flavor |
| **AI Visual Notes** | Visual mode | Short sentences, casual tone, "AI draws casually, I post casually, you browse casually" |

---

## Opening 4-Question Check

> Self-check immediately after writing the opening. If two or more are "no", rewrite the opening.

1. **Curiosity** -- Will the reader think "and then?" after the first paragraph?
2. **Value sense** -- Can the reader sense "there's something to gain from reading this"?
3. **Specificity** -- Is the opening too vague? (concrete scene/detail/number is better)
4. **Audience match** -- Will the target audience be drawn in by this opening?

---

## 3-Layer Stacking Method (Adding Human Touch)

When a paragraph is too "AI", stack these three layers:

1. **Scene layer**: Add specific environment
   - Before: "I encountered a problem while debugging"
   - After: "2 AM. Third cup of coffee gone cold. I'm staring at the red error on screen"

2. **Emotion layer**: Inject genuine feeling
   - Before: "This bug was hard to fix"
   - After: "That moment I genuinely wanted to smash my keyboard"

3. **Detail layer**: Add sensory description
   - Before: "Finally found the solution"
   - After: "When the terminal finally printed green PASSED, dawn was breaking outside"

---

## Anti-Formula (Breaking AI's Forward-Thinking)

AI likes "correct" expressions; humans like "unexpected" turns.

**Formula**: Conventional take + "but" + unexpected detail

**Examples**:
- "Everyone says improve efficiency, but my biggest win this week was learning to leave on time"
- "AI can write perfect summaries, but it'll never suddenly crave hotpot mid-sentence"
- "This tool is really powerful. So powerful I spent three hours studying it to complete a five-minute task"

---

## Step 5.x: Style Iteration Feedback (Triggered by User Edits)

**Trigger**: User manually edited article.md (even a few sentences), **before publishing**.

### Step 5.x.1: Diff Analysis

1. Compare AI draft vs user-edited version, tag each change:
   - **Deleted**: AI wrote it, user removed it -- this expression doesn't fit
   - **Replaced**: AI wrote A, user changed to B -- most valuable, extract rules directly
   - **Added**: User added new content -- angles/expressions AI missed
   - **Reordered**: Sequence changed -- AI's logic flow was off

2. Extract 3-5 specific rules:
   ```
   - Original: "[exact AI text]"
   - Changed to: "[exact user edit]"
   - Rule: [one sentence pattern, e.g., "don't end with parallel structure, just leave blank space"]
   ```

### Step 5.x.2: Update writing-persona.md

Append rules to `writing-persona.md` bottom "Revision Iteration Log":

```markdown
### YYYY-MM-DD Learned from "Article Title"
- [Rule 1]
- [Rule 2]
- [Other findings]
```

### Step 5.x.3: Auto-Cleanup

When "Revision Iteration Log" exceeds 20 entries:
1. Merge duplicate/similar rules
2. Delete rules already covered by the "banned list" (avoid redundancy)
3. Rules appearing 3+ times get promoted to the formal "banned list" or "calibration rules" section

> This is the key mechanism for writing-persona.md to evolve from "static profile" to "living skill". Without this feedback loop, style anchor stays at v1 forever.

---

## Auto-Formatting [CRITICAL]

1. Run `format-text.ts` to fix spaces/punctuation.
2. **Chinese Punctuation Check** [MANDATORY]:
   - Replace ALL English punctuation with Chinese equivalents.
   - Forbidden: `. , ! ? : ; " " ' ' ( )`
   - Required: `。，！？：；""''（）`
   - Exception: Code blocks, URLs, English-only sentences.
3. Apply Humanizer-ZH checklist above.

**Rules**:
1. **Punctuation**: 100% full-width Chinese style.
2. **Cover**: Insert as the first element after frontmatter.
3. **Signature**: Do NOT add signature in article.md — it is appended automatically by content-publisher at publish time.

---

## Image Generation Workflow -- 56 Styles Auto-Rotation + nano Enhancement

> Fully automatic: read catalog -> pick next style -> enhance prompt with nano library -> generate. No asking user about style or nano. User only confirms final images.

### Data File Locations

- **56 style catalog**: `~/.openclaw-antigravity/workspace/images/style-catalog.md`
- **Usage history**: `~/.openclaw-antigravity/workspace/images/style-history.txt`
- **nano reference library**: `nano-banana-pro-prompts-recommend-skill` `references/` directory

### Step 1: Analyze Article Tone

Read the complete article and identify:
- Theme type (tech tutorial / social observation / product review / emotional essay)
- Emotional tone (rational-cool / warm-healing / sharp-sarcastic / light-humorous)
- Visual keywords (extract 3-5 visualizable core concepts from the article)

### Step 2: Auto-Select Style (Don't Ask User)

1. Read `style-history.txt`, find last used style number
2. Next number = last number + 1 (wraps to 1 after 56)
3. Check `style-catalog.md` for that style's: Chinese name, English prompt suffix, suitable tone
4. **Tone match check**: If next style severely clashes with article tone (e.g., serious humanities topic gets "pixel retro"), skip to the next one. Skipped numbers don't get recorded, will come up next time
5. **Combination bonus** (optional): Check catalog's "recommended combos". If current style has a combo matching article tone, use it. Still consumes only one rotation step

### Step 3: Auto-Invoke nano-banana-pro Enhancement

1. Based on article visual keywords, search `nano-banana-pro-prompts-recommend-skill` `references/` for matching reference prompts
2. Fuse reference prompt structure (scene description, lighting, composition) with Step 2's style English suffix
3. Generate final prompt: `[theme scene description], [56-style English prompt suffix], [nano reference enhancement elements]`

### Step 4: Generate Images and Embed (Checkpoint -- show style and images for user confirmation)

1. Tell user this session's style (one line):
   ```
   Style: #XX [Style Name] -- [selection reason, 10 chars max]
   ```
2. Generate images:
   - **Cover**: 2.5:1 ratio (or 16:9), as article's first image
   - **In-text illustrations**: 2-3 images, placed at article's key transition points
3. Save to `{topic-slug}/` and `Desktop/wechat_assets/`
4. **Update style-history.txt**: Append `YYYY-MM-DD article-slug #number style-name`
5. Show images for user confirmation. Can request style change or regeneration

> **Image placement [FORCE]**: `![alt](path)` MUST be embedded at corresponding positions in article.md -- cover right after title, illustrations at section transitions. **FORBIDDEN** to pile all image references at article end.

### Image Generation Tools

**Priority**: gemini-web-image (free, preferred) -> Gemini API (needs key) -> CDP browser (last resort)

**Method 1: gemini-web-image** (preferred, free)
- Via `bun scripts/gemini-image-gen.ts` (auto mode calls this first)
- Or directly: `bun ~/gemini-web-image/gemini-web-image.ts --prompt "..." --output path.png`
- Uses saved browser cookies, zero API cost
- Also available as MCP tool `generate_image` in Claude Code / Gemini CLI / Codex
- First-time setup: `bun ~/gemini-web-image/gemini-web-image.ts --login`

**Method 2: Gemini API** (fallback, costs money)
- Requires `GOOGLE_API_KEY` in `~/.content-publisher/.env`
- Via `bun scripts/gemini-image-gen.ts --method api`

**Method 3: CDP browser** (last resort)
- Via `bun scripts/gemini-image-gen.ts --method cdp`
- Connects to existing Chrome or launches new instance
- **Must confirm model is set to Gemini 3 Pro** (not Fast mode)
- Gemini 3 Fast produces garbled Chinese text in images; only **Pro** renders Chinese correctly

---

## Stage 5.9: Pre-Publish Verification Checklist [MANDATORY]

> Auto-execute, no user action needed (but show results for user confirmation).

| # | Check Item | Method | On Failure |
|---|-----------|--------|-----------|
| 1 | **frontmatter complete** | title + author + category all present | Fill in |
| 2 | **Title not duplicated** | No `# H1` in body | Remove body H1 |
| 3 | **No signature in article.md** | article.md must NOT contain signature HTML (content-publisher adds it) | Remove if present |
| 4 | **Cover image ratio** | Cover exists and is landscape (2.5:1 or 16:9) | Crop or regenerate |
| 5 | **Image placement** | Cover after title, illustrations at transitions, not piled at end | Adjust positions |
| 6 | **Chinese punctuation** | No English punctuation in body (except code blocks and URLs) | Replace |
| 7 | **High-freq word scan** | No "empower/pain point/closed loop/disrupt/deep/precise/build/immersive/all-around" | Replace |
| 8 | **Data source labels** | Every data/statistic has source annotation or confidence downgrade | Add annotation or downgrade |
| 9 | **No Markdown italic** | Body contains no `*italic*` (WeChat renders inconsistently) | Change to other emphasis |

**Output format**:
```
Pre-publish check:
1. frontmatter complete
2. Title not duplicated
3. No signature in article.md -> passed
4-9. All passed

All passed. Ready for content-publisher.
```

**Learning log**: Any failures auto-append to `learnings/2026-MM.md`.

---

## WeChat Formatting Pitfalls

### Ordered List Number Duplication

**Symptom**: Markdown `1. 2. 3.` displays as `1. 1. 2. 2. 3. 3.` in WeChat editor

**Cause**: WeChat editor auto-adds numbers to ordered lists, but Markdown-to-HTML already has numbers in text, causing duplication.

**Solution**: Use bold paragraphs instead of ordered lists in WeChat articles, or use unordered lists (`-`).

### No Italic in WeChat

WeChat rendering of `*italic*` is unstable. Use **bold** or other emphasis methods instead.
