# 📮 WeChat Official Account Publishing Guide

> Two publishing modes available: **API mode** (recommended) and **Browser mode** (fallback).
>
> 💡 API 模式不需要 Chrome，纯后台运行，适合 Bot 自动化；浏览器模式作为兜底方案。

---

## 🎯 What does this do?

Publishes your Markdown article to WeChat Official Account drafts automatically.

> 把 AI 写好的文章（Markdown 格式）自动发布到微信公众号草稿箱。

---

## 🚀 API Mode (Recommended)

No browser needed. Pure HTTP calls to WeChat Developer API.

> 不需要 Chrome，纯 HTTP 调用微信开发者 API，适合 Bot 和无人值守场景。

### Setup (one-time)

1. **Get AppID & AppSecret** from [mp.weixin.qq.com](https://mp.weixin.qq.com) → Settings → Basic Configuration

2. **Add IP whitelist**: Same page → IP Whitelist → Add your server's outbound IP
   ```bash
   curl checkip.amazonaws.com   # Check your outbound IP
   ```

3. **Configure credentials** in `~/.baoyu-skills/.env`:
   ```
   WECHAT_APP_ID=your_app_id
   WECHAT_APP_SECRET=your_app_secret
   ```

### Publish

```bash
cd content-alchemy-repo

# Publish article with cover image
bun ./dependencies/baoyu-skills/skills/baoyu-post-to-wechat/scripts/wechat-api.ts \
  ./your-article/article.md --author "Your Name" --cover ./your-article/cover.png

# Dry run (parse only, don't publish)
bun ./dependencies/baoyu-skills/skills/baoyu-post-to-wechat/scripts/wechat-api.ts \
  ./your-article/article.md --dry-run
```

### Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `40164 invalid ip` | IP not in whitelist | Add the IP shown in error message to whitelist |
| `No cover image` | Article has no images | Add `--cover path/to/cover.png` |
| `45003` | Title too long | Keep title under 20 Chinese characters |

---

## 🔧 Browser Mode (Fallback)

Use when API is not configured. Requires Chrome with debug port.

> API 没配时的兜底方案，需要 Chrome 浏览器。

### Setup (one-time)

1. Install [Google Chrome](https://www.google.com/chrome/)
2. Install project dependencies: see [SETUP.md](./SETUP.md)

### Publish

```bash
cd content-alchemy-repo

bun ./dependencies/baoyu-skills/skills/baoyu-post-to-wechat/scripts/wechat-article.ts \
  --markdown ./your-article/article.md --theme grace
```

The script auto-detects existing Chrome debug ports and reuses them. First run requires WeChat QR code scan.

> ⚠️ **Do not switch windows** during publishing — clipboard operations require Chrome to stay focused.

---

## 👀 Final Step (Manual)

Open WeChat Official Account backend, review the saved draft:

1. **Check formatting** — verify layout looks correct
2. **Check images** — all images inserted properly
3. **Click publish** — send to readers

> 💡 We only save to drafts, never auto-publish. Human review is always required.

---

## 🔒 Security

- **Local execution** — all operations run on your machine, no third-party servers
- **API mode** — uses official WeChat Developer API with your own credentials
- **Browser mode** — uses Chrome DevTools Protocol (CDP), mimics human operations
- **Open source** — all code is transparent and auditable

> ⚠️ **Never commit your AppSecret to git.** Store it in `~/.baoyu-skills/.env` only.

---

## 📚 Related Docs

- [SETUP.md](./SETUP.md) — Installation guide
- [SKILL.md](../SKILL.md) — Content Alchemy workflow
- [README.md](../README.md) — Project overview

---

*Last updated: 2026-02-18*
*Version: v4.3*
