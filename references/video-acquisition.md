# Video Acquisition Methods (with Fallback Chain)

> This file is referenced by SKILL.md Stage 2. Read it when you need to extract video content.
>
> **Key lesson**: yt-dlp is not bulletproof — YouTube detects it as a bot. The methods below are ordered by priority; when one fails, try the next.

---

## Method 1: yt-dlp Direct Subtitle Extraction (Preferred)

Fastest and most controllable. Works for YouTube videos with subtitles.

```bash
# Extract subtitles only (no video download)
yt-dlp --write-auto-sub --sub-lang zh,en --skip-download [URL]

# Extract subtitles as plain text
yt-dlp --write-auto-sub --sub-format vtt --skip-download [URL]
```

**Common failures**:
- `Video unavailable` - IP detected as bot by YouTube
- `403 Forbidden` - Region restriction or anti-crawl
- No subtitle file generated - Video has no subtitles

**On failure → switch to Method 2**

---

## Method 2: NotebookLM Import (YouTube Alternative)

Use Chrome MCP to operate `notebooklm.google.com`: Create Notebook → Add YouTube link → Ask "Give me the complete transcript, not a summary, the original text". Gets full transcript, bypassing yt-dlp bot detection.

**Limitation**: YouTube only (Bilibili/Xiaohongshu can only grab page text). User must be logged into Google. For Bilibili/Xiaohongshu → use Method 3 or Method 5.

---

## Method 3: Browser Subagent DOM Extraction (yt-dlp Fallback)

When yt-dlp is blocked, access YouTube directly via browser to extract Transcript.

**Workflow**:
1. Use Browser Subagent to open YouTube video page
2. Click "Show transcript" button below the video
3. Extract full Transcript via DOM operations
4. Also extract Description as supplement

**Pros**: Simulates real user visit, harder to block
**Cons**: Slower, depends on stable page structure

---

## Method 4: Live Search Strategy (When Specified URL Fails)

When the target video URL is unavailable (deleted, region-locked), don't just error out.

**Workflow**:
1. Extract the original video's title/keywords
2. Search YouTube: `{video_title} site:youtube.com`
3. Find a highly relevant replacement video
4. Mark source: "Alternative source for [Original URL]"
5. Use Methods 1-3 to extract replacement video content

**Example**:
```
Original URL: youtube.com/watch?v=abc123 (Video unavailable)
Search: "Cursor vs Windsurf 2025 AI IDE"
Found: youtube.com/watch?v=xyz789 (Qodo comparison video)
Mark: "Alternative source, original video unavailable"
```

**Core principle: Data availability first, but always annotate source changes**

---

## Method 5: YouTube-First Strategy (Bilibili Video Fallback)

When Bilibili video has no subtitles, search for YouTube mirror.

**Workflow**:
1. Search Bilibili original content
2. If subtitles unavailable:
   - Search YouTube: `{video_title} site:youtube.com`
   - Use Methods 1-3 to extract subtitles
   - Mark source: "YouTube Mirror of [Bilibili URL]"
3. Verify subtitle quality before analysis

**This is about data availability, not censorship bypass**

---

## Method 6: Playwright Bilibili Page Scraping (Quick Screening)

When Bilibili video has no YouTube mirror, use Playwright (browser MCP) to directly visit the Bilibili page and extract available info.

**Purpose**: Quick screening of material value, not deep transcription. Helps decide "is this video worth digging into?"

**What you can get**:

| Content | Extraction Method | Material Value |
|---------|------------------|----------------|
| Video title, description, tags | DOM text | Topic relevance check |
| Hot comments | Bilibili API (`api.bilibili.com/x/v2/reply`) | Real audience reactions, directly quotable |
| UP host info | DOM text | Source attribution |
| CC subtitles (if available) | Enable subtitles then DOM scrape | Near-complete transcript |
| Danmaku (bullet comments) | Bilibili danmaku API or DOM | Real-time emotions, unique material |
| Key frame screenshots | Playwright screenshots | Image references |

**Cannot get**: Full speech transcription for videos without subtitles

**Workflow**:
1. Open Bilibili video page with Playwright (supports short links b23.tv)
2. Screenshot to confirm video content
3. Extract title, description, tags
4. Use Bilibili API for comments (`api.bilibili.com/x/v2/reply?type=1&oid={aid}&sort=1`, sort=1 for hot)
   - **Do NOT grab comments via DOM directly**: Bilibili comments use `bili-comments` Web Component + Shadow DOM + lazy-load, Playwright DOM can't reach the content
5. If CC subtitles exist, switch to subtitle mode and extract text
6. Compile into material card, mark source: "Bilibili Page Extract [URL]"

**Use cases**:
- Bilibili-exclusive content (no YouTube mirror)
- Need comment section/danmaku as material (Bilibili's unique advantage)
- Quick-screen a batch of videos for material value before deep diving

**Combining with other methods**:
- Method 6 screens high-value video → YouTube mirror exists → Methods 1-2 for full transcript
- Method 6 screens high-value video → No mirror but has CC subtitles → Extract directly
- Method 6 screens high-value video → No mirror, no subtitles → Use description + comments only as supplementary material
