# Stage 4: Refining -- First-Principles Narrative Reconstruction

> Read this when entering Stage 4. Contains Deconstruct/Discern/Construct methodology, Three-Perspective Cross-Examination, and Multi-Dimensional Check.
>
> Stage 4 is NOT "assemble sources in order" -- it's about deconstructing verified material and reconstructing a new narrative.
>
> Core method: **Deconstruct -> Discern -> Construct**

---

## Step 4.1: Deconstruct -- Material Decomposition (First Principles)

Break down all verified sources from Stage 3/3.5 into three layers:

| Layer | Content | Example |
|-------|---------|---------|
| Fact | Verifiable data and events | "GPT-4o supports multimodal input" |
| Opinion | Someone's judgment or interpretation | "XX believes this will transform education" |
| Emotion | People's feelings and reactions | "Comments section flooded with job anxiety" |

Each piece of material belongs to exactly one layer. Mixed? Split it -- "this tech is amazing" is opinion, not fact.

---

## Step 4.2: Discern -- Relationship Mapping (Language Precision)

Find the **real** logical relationships between deconstructed materials (not the relationships you wish existed):

- **Causal**: Did A cause B? Or did A and B merely co-occur?
- **Contradictory**: Two facts fighting each other? This tension itself may be your best angle
- **Superficially similar, fundamentally different**: Same-looking phenomena with different underlying logic?
- **Absent**: What's missing? The angle nobody discusses is often the most worth writing about

Most common mistake here: forcing "correlation" into "causation" for narrative flow.

---

## Step 4.2.5: Three-Perspective Cross-Examination

> **When to execute**: User provides raw materials directly, or you gathered sources yourself via Stage 1-2.
> **When to skip**: Materials come from a multi-agent debate package that already includes cross-examination.

Based on the facts/opinions/emotions decomposed in Steps 4.1-4.2, force three opposing perspectives to challenge each other and **expose blind spots**:

| Perspective | Role | Core Question |
|-------------|------|--------------|
| Optimist | Tech believer / Progress advocate | Is the upside being underestimated? Any overlooked opportunities? |
| Pessimist | Risk warner / Critic | Is the optimist cherry-picking evidence? What's the cost? Who gets hurt? |
| Humanist | Detached observer | The other two debate "can we" -- but is anyone asking "should we"? What does this mean for real people? |

**How to execute** (no sub-agents needed, do it yourself):
1. Each perspective: 2-3 core arguments (1-2 sentences each, based on existing materials -- don't fabricate new data)
2. Each perspective must identify at least **1 blind spot** in the other two
3. Surface the **core tension**: What's the most irreconcilable disagreement?

**Output** (write directly in manifesto.md):
```markdown
## Cross-Examination
Optimist: [core argument] -> Blind spot: [identified by pessimist/humanist]
Pessimist: [core argument] -> Blind spot: [identified by optimist/humanist]
Humanist: [core argument] -> Blind spot: [identified by optimist/pessimist]
Core tension: [one sentence -- the conflict most worth writing about]
```

> **Core tension = article's soul**: In Step 4.3, build your narrative around this tension. Without tension, your article is just a summary.

---

## Step 4.3: Construct -- Narrative Reconstruction

From the cleaned-up parts, find a **new structure** to connect them. This structure must be yours, not inherited from the sources.

Method:
1. Write **one sentence** capturing your core insight (not the topic -- the thing you discovered beneath the topic)
2. Based on this insight, decide which materials stay, which get cut, which become background
3. Choose your narrative path: Scene -> Phenomenon -> Question -> Insight -> Open ending (common for social/cultural AI topics), or another structure that fits

---

## Step 4.4: Multi-Dimensional Check (Optional -- for AI + Society content)

If your article connects AI with social/cultural/philosophical themes, verify your narrative covers:

| Dimension | Check Question |
|-----------|---------------|
| Technical | What can AI actually do (or not do) in this context? |
| Human | What does this mean for real people? Who benefits, who loses, who's invisible? |
| Deeper inquiry | One layer deeper -- what does this reveal? Any overlooked angles? |

Fill in missing dimensions. All three present = manifesto ready.

> Pure technical/tutorial content can skip Step 4.4 -- organize by timeline (problem -> attempt -> failure -> solution) instead.

## Checkpoint

Present `{topic-slug}/manifesto.md`. **User must approve the logic.**
