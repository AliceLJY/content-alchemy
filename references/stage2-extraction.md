# Stage 2: Source Extraction

> Read this when entering Stage 2. Contains multi-channel mining strategy, fallback logic, and Source Authenticity Table format.

---

## Multi-Channel Mining

Search across videos, articles, GitHub, papers, news.

## Fallback Logic [MANDATORY]

1. **YouTube-First**: Try `yt-dlp` for automated transcript.
2. **Bilibili Mirror**: If failed, search Bilibili for transcript or manual summary.
3. **Web Search**: If no video found, use `search_web` for deep articles, whitepapers, or transcripts.
4. **AI Knowledge Base**: Last resort. Label as "Level 4: AI Internal Knowledge".

> For detailed video acquisition methods, see [`video-acquisition.md`](video-acquisition.md).

## Source Authenticity Table Format

| Source | Type | Level | Fact Status | Method |
| :--- | :--- | :--- | :--- | :--- |
| [URL/Title] | Video | 1 | Verified | yt-dlp |
| [Title] | Blog | 2 | Verified | browser_subagent |
| [Title] | Social | 3 | Speculative | search_web |
| Internal | AI | 4 | Generative | AI Memory |

## Level Definitions

- **Level 1**: Primary Source (Transcript/Official Paper)
- **Level 2**: Secondary Source (Expert blog/Detailed news)
- **Level 3**: Tertiary Source (Social media/Discussions)
- **Level 4**: AI Hallucination/Knowledge base (No specific source found)

## Checkpoint

Present **Source Authenticity Report**. **User must verify sources.**
