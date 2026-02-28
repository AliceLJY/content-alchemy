# Content Alchemy -- Claude Code Project Memory

## Project Overview

- **Scope**: Stages 1-5 of the content pipeline (Topic Mining -> Source Extraction -> Analysis -> Cross-Reference -> Refining -> Humanized Article)
- **Downstream**: [content-publisher](https://github.com/AliceLJY/content-publisher) handles Stage 6 (distribution) and Stage 7 (cleanup)
- **SKILL.md**: Main workflow definition. Detailed methodology lives in `references/` files
- **Output directory**: `~/Desktop/bot-articles/{topic-slug}/`

## Key Pitfalls

### Stage 3.5: Cross-Reference Verification
- "Has a source" != "Data is correct" -- Stage 3 checks source authority, Stage 3.5 checks data accuracy
- Absolute statements ("global #1", "only", "every year XX million") need triple-check
- AI memory of movie/TV plots is extremely unreliable -- always verify against Douban/IMDb/Wikipedia
- Concept confusion kills credibility (e.g., "overwork death" != "sudden cardiac death")
- Template: `templates/cross-reference-report.md`

### Stage 5: Article Format + Images
- **Title duplication**: frontmatter `title:` is the single source. Never add `# H1` in body
- **Image syntax**: Must use `![alt](path)` in article.md, never raw placeholders
- **Image placement**: Cover after title, illustrations at section transitions. Never pile at end
- **Confidence self-assessment**: When uncertain, downgrade to qualitative descriptions. Never fake precise numbers

### Title De-duplication
- Before writing titles, scan `~/Downloads/article-archive/all/` to avoid angle/imagery collisions
- Check not just title similarity but core imagery reuse ("mirror", "fossil", "death", etc.)

## Environment

- **Runtime**: Bun (for TypeScript scripts)
- **Platform**: macOS
- **Scripts**: `scripts/format-text.ts` (punctuation/spacing), `scripts/preprocess_article.py` (MD->HTML)
