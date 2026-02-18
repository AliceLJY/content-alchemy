# Content Alchemy — Testing Guide

> Copy-paste these prompts to test each feature module.
>
> > 以下是实际验证过的测试话术，复制粘贴即可测试对应功能。

---

## 1. Full Pipeline Test (End-to-End)

```
帮我写一篇公众号文章，话题是"Cursor vs Windsurf 2025对比"，
从搜索素材开始，完成后保存到微信草稿箱。
```

## 2. YouTube Video Extraction

**Option A: With NotebookLM (recommended, full transcript)**
```
帮我用 NotebookLM 提取这个 YouTube 视频的完整文字稿：
https://www.youtube.com/watch?v=XXXXX

步骤：
1. 打开 notebooklm.google.com
2. 创建新 notebook
3. 添加这个视频链接
4. 提问"请给我这个视频的完整文字稿/transcript，不要总结，要原文"
```

**Option B: Without NotebookLM (yt-dlp)**
```
帮我提取这个 YouTube 视频的字幕：
https://www.youtube.com/watch?v=XXXXX

使用 yt-dlp 命令：
yt-dlp --write-auto-sub --sub-lang zh,en --skip-download [URL]
```

## 3. Video Extraction Fallback

```
帮我从这个 YouTube 视频采集素材：
https://www.youtube.com/watch?v=XXXXX

如果 yt-dlp 失败，请：
1. 尝试 NotebookLM 自动化导入
2. 如果仍失败，使用 Browser 直接访问页面提取 Transcript
3. 如果视频不可用，搜索同主题替代视频
```

## 4. WeChat Publishing

```
帮我把这个文件发布到微信公众号草稿箱：
~/Documents/test.md

前提：Chrome 已用 --remote-debugging-port=9222 启动
```

## 5. Write from Existing Document

```
跳过素材采集，直接用这份文档作为输入，
从 Stage 5 开始生成公众号文章并发布草稿：

./my-draft.md
```

## 6. Publish Only

```
publish "我的文章标题"

# 仅执行 Stage 6，自动处理图片路径转换
```

## 7. Illustration Style Selection (Antigravity)

```
我有一篇关于 "AI 对人类语言系统的入侵" 的文章，需要配 3 张插图。

请先参考 nano-banana-pro 风格库，推荐 2-3 种适合的配图风格让我选择，
我选好风格后再生成图片。

文章内容：[粘贴文章或提供文件路径]
```

**Expected behavior:**
1. AI analyzes article theme and tone
2. Searches nano-banana-pro reference library for relevant styles
3. Presents 2-3 style options (e.g., cyberpunk, Black Mirror surreal, minimalist tech)
4. Waits for user selection before generating images

---

## Platform Support Quick Reference

| Video Source | NotebookLM | yt-dlp | Browser DOM | Playwright MCP |
|-------------|------------|--------|-------------|---------------|
| YouTube | Full transcript | Subtitles | Transcript | Transcript |
| Bilibili | Page text only | Not supported | CC subtitles only | Title+description+comments+danmaku |
| Xiaohongshu | Page text only | Not supported | No subtitles | Title+description (login required) |

**Bilibili / Xiaohongshu videos:**
- Primary: Method 6 (Playwright MCP) — extract page info directly
- Fallback: Search YouTube mirror `{video title} site:youtube.com`
