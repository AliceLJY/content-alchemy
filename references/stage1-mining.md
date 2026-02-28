# Stage 1: Topic Mining

> Read this when entering Stage 1. Contains topic type identification table, search strategy per type, and hot topic handling rules.

---

## Step 1.1: Topic Type Identification (Mandatory)

Before searching anything, **identify the topic type**:

| Topic Type | Criteria | Examples |
|-----------|----------|----------|
| **Tech/Tools** | Specific software/programming/errors/config | "Cursor vs Windsurf", "Docker deploy", "Python error" |
| **AI Product Review** | Evaluating an AI product/model/service | "ChatGPT vs Claude", "Midjourney review" |
| **Industry Trends** | Analyzing industry dynamics/market/policy | "2025 AI trends", "LLM price war" |
| **Social Observation** | Social phenomena/emotions/life | "lying flat", "35-year crisis", "overwork culture" |
| **Personal Growth** | Career/learning/psychology/emotions | "overcoming anxiety", "career change advice" |
| **Hot News** | Generic "hot topic"/"news" requests | "today's hot topics", "this week's news" |

## Step 1.2: Search Strategy by Type

Based on identification, use the corresponding search sources:

- **Tech/Tools** -> Google -> GitHub -> Official Docs -> Stack Overflow -> YouTube tutorials
- **AI Product Review** -> Official site -> Twitter/author updates -> YouTube demos -> Reddit -> Chinese reviews
- **Industry Trends** -> arXiv papers -> Tech media (TechCrunch/The Verge) -> Twitter KOLs -> Investment reports
- **Social Observation** -> Weibo Hot Search -> Xiaohongshu/Zhihu comments -> Douban groups -> Deep reports -> Academic research
- **Personal Growth** -> Xiaohongshu real stories -> Zhihu top answers -> Podcast interviews -> Reddit anonymous posts
- **Hot News** -> **Ask user first** which category (tech/social/finance/entertainment), then select strategy

**When user says "search hot topics" without specifying type**:
- Do NOT default to tech/AI news
- Ask: "What kind of hot topics? Tech / Social / Finance / Entertainment / Other?"

## Step 1.3: Execute Search

- **Action**: Multi-source search based on topic type and corresponding channels
- **Checkpoint**: Present `{topic-slug}/mining-report.md`. **User must approve topics.**

> For detailed search source lists, see [`source-channels.md`](source-channels.md).
