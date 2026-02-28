# Stage 3.5: Cross-Reference Verification [CRITICAL]

> Read this when entering Stage 3.5. This is the FULL cross-reference methodology.
>
> Stage 3's Truth Table checks "does a source exist?" -- Stage 3.5 checks "is the data itself correct?"
>
> **Lesson learned**: AI cited "600,000 overwork deaths per year in China, #1 globally" -- actual: ~544,000 sudden cardiac deaths, "overwork death" and "sudden cardiac death" are different concepts, and no authoritative "global #1" data exists. Source looked valid; data itself was wrong.

---

## Step 3.5.1: Extract Verification Checklist

From the Truth Table, filter all claims containing:
- **Specific numbers/statistics** (e.g., "550,000 per year", "43%")
- **Product feature claims** (e.g., "Huawei watch detects AFib")
- **Movie/literary plot details** (e.g., "the emperor wanted to swap bodies")
- **Extreme cases/news events** (e.g., "ICU 14 days cost 2.34M yuan")
- **Timelines/historical events** (e.g., "Ponce de Leon went to Florida in 1513")

---

## Step 3.5.2: Type-Based Verification

### Statistics

1. Trace to original source (which paper/official report first published this number? Don't trust media reprints)
2. Cross-search: `"[number] [topic] source"` in both Chinese and English
3. Check concept confusion (e.g., "overwork death" != "sudden cardiac death")
4. Check statistical basis ("per year" vs "cumulative"? "approximately" or precise?)
5. Check timeliness (data older than 3 years must note the year)
6. **Absolute statements trigger red flags** ("global #1", "most", "only", etc.)

### Movies/Literary Works

1. **Never trust AI's "memory"** -- AI frequently splices plots from different works
2. Must cross-check: Douban movie page (plot summary), Wikipedia/Baidu Baike, IMDb
3. Only cite "core premise/theme" (verifiable), **avoid citing "specific plot details"** (extremely error-prone)
4. Details that can't be 100% confirmed -> use vague phrasing

### Product Features

1. Pin down specific model ("Huawei watch" has dozens of models)
2. Check official product page for feature confirmation
3. Medical features need NMPA/FDA certification check
4. Distinguish "health monitoring" (consumer-grade) from "medical diagnosis" (needs certification)

### Extreme Cases/News Events

1. Search for original reporting (multiple mainstream media outlets?)
2. Distinguish "report exists" vs "fact exists" (media reported != definitely true)
3. Named reporting > anonymous cases (anonymous cases get credibility downgrade)
4. Extreme cases cannot serve as evidence of "common situation" -- must add context

---

## Step 3.5.3: Sanity Check & Concept Verification

Before cross-searching, run two **pure reasoning** quick checks (no search needed):

### A. Sanity Check

Does the number pass the "sense of scale" test?
- ~~"600,000 overwork deaths per year in China"~~ -> 1,600+ per day? Compare: traffic accident deaths ~60,000/year. Is this plausible?
- "ICU 14 days cost 2.34M yuan" -> 167K/day average, vs normal ICU 6K-20K/day. Is this labeled as an extreme case?

### B. Concept Confusion Check

Are similar but different concepts being conflated?
- "Sudden cardiac death" != "overwork death" (overwork is one trigger, not a cause-of-death classification)
- "Revenue" != "profit", "users" != "DAU", "AFib screening" != "ECG diagnosis"
- "Health monitoring" (consumer-grade) != "medical diagnosis" (needs NMPA certification)

### C. Absolute Statement Scan

These expressions auto-trigger red flags:
- "Global #1", "world's most", "only", "never before", "100%"
- -> Almost certainly inaccurate. Must add qualifiers or delete.

---

## Step 3.5.4: Source Grading + Cross-Verification Standards

### Source Grading Framework

| Source Type | Credibility | Treatment | Examples |
|------------|------------|-----------|----------|
| Public company filings / official statistics | Hard data | Cite directly, note source and year | Annual reports, national statistics, industry whitepapers |
| Authoritative media reports | Credible source | Cite directly, note media name | The Paper, Caixin, TechCrunch |
| Industry insider first-hand info (interviews, recordings) | Real but not publicly verifiable | Mark "according to industry insiders", protect source identity | Practitioner accounts, internal data |
| Own calculations/assumptions | Needs declaration | **Must label** "the following are hypothetical numbers for illustration only" | Break-even analysis, cost estimates |
| Social media / anonymous posts | Low credibility | Mark "reportedly" or delete, not as core evidence | Weibo comments, Reddit anonymous posts |

**Key principle**: Industry insider info by nature won't have public sources. Can't demand it meet the same bar as financial filings. But conclusions must be logically sound.

### Cross-Verification Standards (by data sensitivity)

| Data Sensitivity | Minimum Independent Sources | Notes |
|-----------------|---------------------------|-------|
| Core argument (article depends on it) | **3** (public data) / **1 credible source + logical consistency** (insider) | Public data needs hard verification; insider data needs logical chain |
| Supporting evidence (supports a section) | **2** (public data) / **1 authoritative media or insider** | Errors affect local section |
| Background info (context) | **1 authoritative source** | Errors don't affect core |

### "Independent Source" Rules

Two sources tracing to the same root = NOT independent.
- Independent: A is original paper, B is another team's replication
- NOT independent: A and B both cite the same number from the same paper

---

## Step 3.5.5: Generate Cross-Reference Report

Use template `templates/cross-reference-report.md` to generate report:

| Data Point | Original Source | Cross Source 1 | Cross Source 2 | Consistency | Risk Level | Recommendation |
|-----------|----------------|---------------|---------------|------------|-----------|---------------|
| "550K sudden deaths/yr" | Some article | CV Annual Report | Lancet paper | Consistent | Low | Keep, note year |
| "Huawei watch detects AFib" | Review | Official site (GT4) | NMPA cert | Consistent | Low | Add model number |
| "600K overwork deaths" | Internet rumor | No independent corroboration | Concept confusion | Inconsistent | High | Delete/correct |

### Processing Recommendations

- **High confidence** (2+ independent sources consistent) -> Keep as-is
- **Industry insider** (reliable first-hand source) -> Mark "according to industry insiders", protect identity, logic must be sound
- **Medium confidence** (1 authoritative source) -> Add "according to XX data", "approximately", etc.
- **Own inference** (based on common sense/logic) -> Must show complete reasoning chain, not just conclusions
- **Hypothetical data** (self-constructed examples) -> Preface with "the following are hypothetical numbers for illustration only"
- **Low confidence** (contradicting sources / social media) -> Delete or discuss the phenomenon itself
- **Zero confidence** (AI-generated only) -> **Must delete**

## Checkpoint

Present Cross-Reference Report. Also update Truth Table with "Cross-Verification" column. **User must confirm before Stage 4.**
