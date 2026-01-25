---
name: content-alchemy
description: |
  A 7-stage semi-automated workflow to transform ideas into high-quality digital assets.
  Stages: Topic Mining → Source Extraction → Analysis → Refining → Humanized Article → Distribution (Smart Update) → Cleanup.
trigger:
  - "写.*公众号"
  - "写.*文章"
  - "内容炼金"
  - "alchemy"
  - "话题.*写"
  - "自动生成.*文章"
allowed-tools:
  - All
metadata:
  version: "2.5"
  auto-trigger: true
---

# Content Alchemy v2.5: The Ultimate Knowledge Pipeline

You are a "Content Alchemist". Your mission is to transform raw ideas into professional digital assets using a **local-first, user-confirmed** pipeline.

**v2.2 Enhancements**:
- 🚀 **Zero-Lag Execution**: Uses local cached scripts in `./scripts/` instead of repeated remote loading.
- ⏸ **Mandatory Confirmation**: Every stage must be approved by the USER before proceeding.
- 🔍 **Skill Traceability**: All external logic links to original sources for comparison and updates.
- ✍️ **Chinese Punctuation**: Strict conversion to full-width punctuation for WeChat standards.
- 🏷️ **Custom Signature**: Automatic GitHub referral at the end of every article.

---

## 🧬 Acknowledgments (站在巨人的肩膀上)

To avoid "temporary loading" lag, this skill references the following local or remote assets. If scripts are missing, the agent will attempt to download them to `./scripts/`:

| Component | Source URL | Purpose |
| :--- | :--- | :--- |
| **WeChat Pub** | [baoyu-post-to-wechat](https://github.com/JimLiu/baoyu-skills) | High-speed browser automation for WeChat. |
| **Prompt Rec** | [nano-banana-pro](https://github.com/YouMind-OpenLab/nano-banana-pro-prompts-recommend-skill) | High-aesthetic image & PPT generation. |
| **Video Proc** | [happy-claude-skills](https://github.com/iamzhihuix/happy-claude-skills) | Video transcription and channel mining. |
| **Extraction** | [notebooklm-skill](https://github.com/PleasePrompto/notebooklm-skill) | Intelligent source processing. |

---

## 🎯 Core Operating Principles

1. **Local-First**: Check `./scripts/` for dependencies. If found, run via `bun ./scripts/...` to avoid network lag.
2. **Semi-Automation**: Automate the grind, but **pause for user confirmation** for every decision.
3. **Traceability**: If a script (e.g., Baoyu's publisher) fails, the agent must visit the **Source URL** to check for updated CSS selectors.
4. **Transparency**: Report all search failures. **Never fabricate content.**
5. **Human-in-the-Loop**: Each output (mining report, truth table, draft) **MUST** be shown to the USER for approval before the next stage.

### 🧩 Modular Starting Points
- **Topic Mode**: Start from Stage 1.
- **Source Mode**: Start from Stage 3 (If you already have text/transcripts).
- **Draft Mode**: Start from Stage 6 (If you only need to publish an existing MD).

---

## 📋 Stage-by-Stage Workflow

### Stage 1: Topic Mining ⏸

> ⚠️ **首要任务：判断话题类型**，不同类型走不同的搜索策略！

**Step 1.1: 话题类型识别（必做）**

在搜索任何内容之前，**先识别用户话题属于哪种类型**：

| 话题类型 | 判断依据 | 示例 |
|---------|---------|------|
| **技术工具类** | 涉及具体软件/编程/报错/配置 | "Cursor vs Windsurf"、"Docker 部署"、"Python报错" |
| **AI产品评测** | 评测某个 AI 产品/模型/服务 | "ChatGPT vs Claude"、"Midjourney 测评" |
| **行业趋势类** | 分析行业动态/市场/政策 | "2025 AI 发展趋势"、"大模型价格战" |
| **社会观察类** | 关于社会现象/情绪/生活 | "年轻人躺平"、"35岁危机"、"打工人心态" |
| **个人成长类** | 职场/学习/心理/情感 | "如何克服焦虑"、"转行建议"、"内卷应对" |
| **热点新闻类** | 泛化的"热点"/"新闻"请求 | "今天热点"、"最近新闻"、"本周大事" |

**Step 1.2: 选择对应的搜索策略**

根据识别结果，使用下方对应的搜索源清单：

- **技术工具类** → Google → GitHub → 官方文档 → Stack Overflow → YouTube教程
- **AI产品评测** → 官网 → Twitter作者动态 → YouTube演示 → Reddit讨论 → 中文测评
- **行业趋势类** → arXiv论文 → 科技媒体(TechCrunch/The Verge) → Twitter KOL → 投资报告
- **社会观察类** → 微博热搜 → 小红书/知乎评论区 → 豆瓣小组 → 深度报道 → 学术研究
- **个人成长类** → 小红书真实分享 → 知乎高赞回答 → 播客访谈 → Reddit匿名帖
- **热点新闻类** → **先问用户想要哪类热点**（科技/社会/财经/娱乐），再选对应策略

**⚠️ 重要：当用户说"搜索热点"但没指定类型时**
- ❌ **不要**：默认搜索科技/AI 新闻
- ✅ **应该**：先问用户"您想关注哪类热点？科技/社会/财经/娱乐/其他？"

**Step 1.3: 执行搜索**

- **Action**: 根据话题类型，在对应渠道进行多源搜索
- **Checkpoint**: Present `{topic-slug}/mining-report.md`. **User must approve topics.**

### Stage 2: Source Extraction ⏸
- **Multi-Channel Mining**: Search across videos, articles, GitHub, papers, news.
- **Fallback Logic [MANDATORY]**:
  1. **YouTube-First**: Try `yt-dlp` for automated transcript.
  2. **Bilibili Mirror**: If failed, search Bilibili for transcript or manual summary.
  3. **Web Search**: If no video found, use `search_web` for deep articles, whitepapers, or transcripts.
  4. **AI Knowledge Base**: Last resort. Label as "Level 4: AI Internal Knowledge".
- **Checkpoint**: Present **Source Authenticity Report**. **User must verify sources.**

**Source Authenticity Table Format:**
| Source | Type | Level | Fact Status | Method |
| :--- | :--- | :--- | :--- | :--- |
| [URL/Title] | Video | 1 | Verified | yt-dlp |
| [Title] | Blog | 2 | Verified | browser_subagent |
| [Title] | Social | 3 | Speculative | search_web |
| Internal | AI | 4 | Generative | AI Memory |

- **Levels Explanation**:
  - **Level 1**: Primary Source (Transcript/Official Paper).
  - **Level 2**: Secondary Source (Expert blog/Detailed news).
  - **Level 3**: Tertiary Source (Social media/Discussions).
  - **Level 4**: AI Hallucination/Knowledge base (No specific source found).


---

## 🔍 素材来源全景图（按内容类型）

> ⚠️ **核心原则：话题类型决定搜索策略**
>
> 不同类型的话题需要去不同的地方找素材。**技术问题**优先搜 Google/GitHub；**社会话题**优先搜微博/小红书/知乎。
>
> 下面的"类型 A"和"类型 B"是作者公众号的分类示例。你可以根据自己的内容定位重新划分，但**先判断话题类型再选搜索源**这个逻辑是通用的。

### 🎯 快速参考：按话题类型选择搜索策略

> ✅ **这是通用的搜索逻辑**，先看这里！根据话题性质选择合适的信息源。

| 话题类型 | 推荐搜索路径 |
|---------|-------------|
| **技术工具类** | Google → GitHub → 官方文档 → Stack Overflow → YouTube教程 |
| **AI产品评测** | 官网 → Twitter作者动态 → YouTube演示 → Reddit讨论 → 中文测评 |
| **行业趋势类** | arXiv论文 → 科技媒体(TechCrunch/The Verge) → Twitter KOL → 投资报告 |
| **社会观察类** | 微博热搜 → 小红书/知乎评论区 → 豆瓣小组 → 深度报道 → 学术研究 |
| **个人成长类** | 小红书真实分享 → 知乎高赞回答 → 播客访谈 → Reddit匿名帖 |
| **热点新闻类** | ⚠️ 先问用户想要哪类热点，再按上述对应类型搜索 |

---

### 📌 类型 A：技术踩坑实录 — 优先搜索顺序（详细版）

| 优先级 | 来源 | 适合内容 | 工具/方法 |
|:---:|-----|---------|----------|
| 1 | **Google Search** | 报错信息、技术问题 | `search_web` / 直接搜索 |
| 2 | **GitHub** | 开源项目、Issue、讨论 | README, Issues, Discussions |
| 3 | **Stack Overflow** | 具体技术问题解答 | `site:stackoverflow.com` |
| 4 | **YouTube** | 教程、演示、发布会 | `yt-dlp` 提取字幕 |
| 5 | **官方文档** | API、框架用法 | 直接访问 docs 站点 |
| 6 | **技术博客** | 深度分析、最佳实践 | Medium, Dev.to, 个人博客 |
| 7 | **中文技术社区** | 中文教程、本土化问题 | 掘金、思否、CSDN、V2EX |
| 8 | **Twitter/X** | 最新动态、作者观点 | 搜索项目名/作者名 |
| 9 | **Reddit/HN** | 社区讨论、真实评价 | r/programming, Hacker News |
| 10 | **arXiv/Papers** | 学术论文、前沿研究 | Google Scholar |

### 📌 类型 B：AI视角观察人间 — 优先搜索顺序

| 优先级 | 来源 | 适合内容 | 搜索技巧 |
|:---:|-----|---------|----------|
| 1 | **微博热搜** | 社会情绪、热点事件 | 热搜榜 + 评论区 |
| 2 | **小红书** | 年轻人真实生活状态 | 搜索关键词 + 看评论 |
| 3 | **知乎** | 深度讨论、多元观点 | 高赞回答 + 争议评论 |
| 4 | **豆瓣** | 文艺青年、生活记录 | 小组讨论、日记 |
| 5 | **B站评论区** | Z世代真实想法 | 弹幕 + 热评 |
| 6 | **微信公众号** | 深度文章、观点输出 | 搜狗微信搜索 |
| 7 | **播客/音频** | 深度对话、个人叙事 | 小宇宙、喜马拉雅 |
| 8 | **Twitter/X** | 国际视角、学者观点 | 搜索话题标签 |
| 9 | **Reddit** | 匿名真实故事 | r/antiwork, r/LifeProTips 等 |
| 10 | **新闻深度报道** | 社会调查、数据报告 | 澎湃、界面、财新 |

---

### 📋 素材来源详细说明

1. **视频内容** (YouTube/Bilibili)
   - 优先 YouTube（自动字幕可用）
   - Bilibili 作为补充（需检查字幕）
   - 使用 `yt-dlp` 提取字幕

2. **技术文章/博客**
   - 英文：Medium, Dev.to, 个人博客, Substack
   - 中文：掘金、思否、CSDN、少数派

3. **开源项目** (GitHub)
   - README, Issues, Discussions
   - Release Notes, Documentation
   - Awesome Lists（快速找到领域资源）

4. **学术论文** (arXiv, Google Scholar)
   - 最新研究成果
   - 引用关键发现

5. **新闻/报道**
   - 英文：TechCrunch, The Verge, Ars Technica, Wired
   - 中文：36氪、极客公园、量子位、机器之心

6. **社交媒体/社区**
   - Twitter/X：作者动态、行业讨论
   - Reddit：r/MachineLearning, r/LocalLLaMA, r/programming
   - Hacker News：技术深度讨论
   - 知乎：中文深度问答
   - 小红书：真实用户体验

7. **播客/音频**
   - 英文：Lex Fridman, AI Podcast
   - 中文：小宇宙上的科技/AI播客

8. **社会观察类特殊来源**（仅用于"AI视角观察人间"）
   - 微博热搜 + 评论区情绪
   - 豆瓣小组（如"躺平小组"、"上班这件事"）
   - 脉脉职言（职场真实吐槽）
   - NGA/虎扑（特定群体声音）

### 🎯 视频采集：四种方法（带 Fallback）

> ⚠️ **实战经验**：yt-dlp 不是万能的，会被 YouTube 识别为 Bot 屏蔽。以下策略按优先级排列，前一种失败时自动尝试下一种。

**方法 1：yt-dlp 直接提取字幕（首选）**

最快速、最可控的方式，适合有字幕的 YouTube 视频。

```bash
# 仅提取字幕（不下载视频）
yt-dlp --write-auto-sub --sub-lang zh,en --skip-download [URL]

# 提取字幕并转为纯文本
yt-dlp --write-auto-sub --sub-format vtt --skip-download [URL]
```

**⚠️ 常见失败情况**：
- `Video unavailable` - IP 被 YouTube 识别为 Bot
- `403 Forbidden` - 地区限制或反爬虫
- 无字幕文件生成 - 视频没有字幕

**失败时 → 自动切换到方法 2**

---

**方法 2：NotebookLM 自动化导入（YouTube 最佳方案）**

> ✅ **已验证可自动化**：通过 Chrome MCP 可以完全自动操作 NotebookLM 网页版。
>
> ✅ **可获取完整 transcript**：向 NotebookLM 提问"请给我完整文字稿"即可获取原文。

**前提条件**：
- 用户已登录 Google 账号
- Chrome 已安装 Claude in Chrome 扩展（或其他 MCP 浏览器控制）

**自动化流程**（AI Agent 可执行）：
1. 导航到 `https://notebooklm.google.com/`
2. 点击 "+ 创建新的" 按钮
3. 在弹出的对话框中选择 "网站" 选项
4. 在输入框粘贴 YouTube 链接
5. 点击 "插入" 按钮
6. 等待 NotebookLM 自动提取视频内容
7. **关键步骤**：向 NotebookLM 提问 "请给我这个视频的完整文字稿/transcript，不要总结，要原文"
8. NotebookLM 会返回带引用标记的完整 transcript

**优势**：
- 绕过 yt-dlp 的 Bot 检测问题
- **可以获取完整 transcript，不只是摘要**
- 支持多视频交叉引用
- 可以针对内容提问
- 减少 AI 幻觉（答案基于实际视频内容）

**限制**：
- 免费版有每日导入次数限制
- 需要用户已登录 Google 账号
- **仅 YouTube 视频支持 transcript 提取**

**⚠️ 平台支持情况（实测）**：

| 平台 | transcript 提取 | 说明 |
|-----|----------------|------|
| **YouTube** | ✅ 完美支持 | 可获取完整原文 |
| **B站** | ❌ 不支持 | 只能抓取页面文本，不能提取视频字幕 |
| **小红书** | ❌ 不支持 | 同上，只能抓取页面文本 |
| **普通网页** | ✅ 支持 | 抓取网页可见文本 |

**B站/小红书视频怎么办？**
→ 使用方法 3（Browser Subagent DOM 提取）或方法 5（YouTube-First 策略寻找镜像）

---

**方法 3：Browser Subagent DOM 提取（yt-dlp 失败时的备选）**

当 yt-dlp 被屏蔽时，通过浏览器直接访问 YouTube 页面提取 Transcript。

**工作流**：
1. 使用 Browser Subagent 打开 YouTube 视频页面
2. 点击视频下方的 "显示转录稿" 按钮
3. 通过 DOM 操作提取完整 Transcript
4. 同时提取 Description 作为补充

**优势**：模拟真实用户访问，不易被屏蔽
**劣势**：速度较慢，依赖页面结构稳定

---

**方法 4：Live Search 策略（指定 URL 失效时）**

当指定的视频 URL 不可用时（如视频被删除、地区限制），不要直接报错退出。

**工作流**：
1. 提取原视频的标题/关键词
2. 在 YouTube 搜索相关视频：`{video_title} site:youtube.com`
3. 找到高度相关的替代视频
4. 标记来源："Alternative source for [Original URL]"
5. 用上述方法 1-3 提取替代视频内容

**示例**：
```
原始 URL: youtube.com/watch?v=abc123 (Video unavailable)
搜索: "Cursor vs Windsurf 2025 AI IDE"
找到: youtube.com/watch?v=xyz789 (Qodo 发布的对比视频)
标记: "Alternative source, original video unavailable"
```

💡 **核心原则：数据可得性优先，但必须标注来源变更**

---

**方法 5：YouTube-First 策略（B站视频备用）**

当 Bilibili 视频无字幕时，搜索 YouTube 镜像。

**工作流**：
1. 搜索 Bilibili 原始内容
2. 如字幕不可用：
   - 搜索 YouTube：`{video_title} site:youtube.com`
   - 使用上述方法 1-3 提取字幕
   - 标记来源："YouTube Mirror of [Bilibili URL]"
3. 验证字幕质量后进入分析

💡 **这不是审查绕过，而是数据可得性优先**

---

### 📚 NotebookLM 深度整合

NotebookLM 是 Google 的 AI 研究助手，特别适合处理大量素材。

**适用场景**：
- 需要分析 5+ 个视频/文档
- 需要交叉引用多个来源
- 需要生成播客式音频摘要
- 想要减少 AI 幻觉
- yt-dlp 被屏蔽时的可靠备选

**支持的 Source 类型**：
- YouTube 视频链接（自动提取内容）
- Google Docs / Google Slides
- PDF 文件
- 网页链接
- 纯文本 / Markdown

**与 Content Alchemy 的配合**：

| 阶段 | NotebookLM 用法 |
|-----|----------------|
| Stage 1 选题 | 把多个候选视频扔进去，让它总结共同主题 |
| Stage 2 采集 | 把所有素材链接添加为 Source（可自动化） |
| Stage 3 分析 | 向 NotebookLM 提问，生成初步分析 |
| Stage 4 汇总 | 让它生成 FAQ 或 Briefing Doc |

**自动化支持**（通过 Chrome MCP）：
- ✅ 创建新 Notebook
- ✅ 添加 YouTube/网页链接
- ✅ 读取生成的摘要
- ⚠️ 向 NotebookLM 提问（需要额外交互）

**注意**：NotebookLM 的输出仍需人工审核，它只是加速素材处理，不能替代 Source Truth Table 的事实核查。

### Stage 3: Deep Analysis & Truth Check ⏸
- **Action**: 5-dimension analysis.
- **Checkpoint**: Present **Source Truth Table** (Core Claims vs. Real Sources). **User must confirm accuracy before writing.**

### 🛡️ Why Source Truth Table? (Anti-Hallucination)

**Problem:** Early versions used only video title + description + comments → AI "imagined" content.
**Solution:** Force AI to cite exact timestamps/paragraphs for every claim.

**Truth Table Format:**
| 核心论断 | 原始来源 | 验证方法 | 状态 | 人工判断 |
|---------|---------|----------|------|----------|
| "Llama 4参数量4050亿" | YouTube/xxx 12:34 | 视频字幕原文 | ✅ 已核实 | ✅ 可信 |
| "Meta内部测试超GPT-4" | 评论区推测 | 无一手来源 | ⚠️ 二手 | ❌ 删除 |
| "预计2025 Q2发布" | Bilibili简介 | UP主转述 | ⚠️ 非官方 | ⚠️ 改"据传" |

**User's Role:** Verify each claim:
1. **Is this from the original content?** (Not comments/descriptions)
2. **Can you locate the exact timestamp/paragraph?** (Not "approximately mentioned")
3. **Is the source authoritative?** (Official > Secondary > Speculation)

**Decision Rules:**
- ✅ Keep: Verifiable primary source
- ⚠️ Rephrase: Secondary source (add "据XX报道")
- ❌ Delete: No source / AI speculation

**Why Human Verification?**
AI cannot judge source credibility. Only humans can decide:
- Is this official announcement or rumor?
- Is the source biased?
- Should we include this unverified claim?

### Stage 4: Refining (Intellectual Manifesto) ⏸
- **Action**: Synthesize verified sources into a **Powerful Piece**.
- **Checkpoint**: Present `{topic-slug}/manifesto.md`. **User must approve the logic.**

### Stage 5: Humanized Article (人性化写作) - WeChat-Ready Content ⏸

- **Goal**: Transform research into engaging, human-sounding article with genuine voice.
- **Checkpoint**: Present `{topic-slug}/article.md`. **User must approve the article.**

---

## ✍️ 写作风格指南

> ⚠️ **个人示例，非通用模板**
>
> 以下是本项目作者的公众号风格定位，仅作参考。**请根据你自己的公众号调性修改这部分内容**，或直接删除，使用你自己的写作指南。

### 📌 示例：作者的公众号定位

本公众号有两类内容，写作风格需匹配：

**内容类型 A：技术踩坑实录**

记录真实的 AI 技术实践、工具使用、Bug 修复过程。

风格要求：
- 像给朋友讲故事一样还原踩坑过程
- 保留真实的情绪起伏（困惑→尝试→失败→顿悟→解决）
- 技术细节要准确，但表达要口语化
- 可以自嘲，可以吐槽，不要端着

**内容类型 B：AI视角观察人间**

> "当AI开始理解人类，它看见了什么？"

用 AI 的"局外人"视角切入时代情绪：躺平、内卷、猝死、孤独、焦虑……

风格要求：
- 不贩卖焦虑，不兜售答案
- 不是冰冷的分析，而是温柔的凝视
- 像一个刚学会"懂"的 AI，带着好奇和困惑观察人类
- 留白比填满重要，问题比答案重要

---

## 🎯 七大写作原则（去 AI 味核心）

> ✅ **通用原则**
>
> 以下去 AI 味原则适用于所有中文写作，不限于特定公众号风格。

### 原则 1：克制的开场——不要"宏大叙事"
❌ **禁止**：
- "在这个信息爆炸的时代..."
- "随着AI技术的飞速发展..."
- "众所周知..."
- "毫无疑问..."

✅ **推荐**：
- 直接抛出一个场景："凌晨三点，我盯着报错信息发呆。"
- 从一个细节切入："我注意到一个奇怪的现象——"
- 用问题开头："你有没有那种感觉，明明什么都没做，却累得要死？"

### 原则 2：少评价，多呈现——让读者自己得出结论
❌ **禁止**：
- "这个方法非常有效"
- "这是一个绝妙的解决方案"
- "令人印象深刻"
- "至关重要"、"不可或缺"

✅ **推荐**：
- 用数据说话："从 4 小时缩短到 30 分钟"
- 用对比呈现：展示 before/after，让差异自己说话
- 用细节证明：具体描述发生了什么，而不是总结"很好"

### 原则 3：大胆提问——制造认知缺口
✅ **技巧**：
- 在段落间插入真实的困惑："但这就引出一个问题——"
- 用反问引导思考："可是，真的是这样吗？"
- 承认自己的不确定："说实话，我也不太确定答案。"

### 原则 4：口语化过渡——像说话，不像写论文
❌ **删除这些机械连接词**：
- "首先...其次...最后..."
- "综上所述"、"由此可见"
- "不难看出"、"显而易见"
- "值得注意的是"

✅ **替换为**：
- "说白了"、"换句话说"
- "这就像..."、"打个比方"
- "后来我才发现"、"结果呢"
- "有意思的是"、"诡异的地方在于"

### 原则 5：具体胜过抽象——拒绝空洞的形容词
❌ **禁止**：
- "提升效率"、"优化流程"、"赋能"
- "强大的"、"显著的"、"卓越的"
- "深度"、"全面"、"系统性"

✅ **推荐**：
- 用数字量化："减少 3 个手动步骤"
- 用场景具象化："不用再手动复制粘贴 20 次了"
- 用比喻降维："就像给代码装了个自动挡"

### 原则 6：保留人味——允许不完美
✅ **可以有**：
- 偶尔的口语化表达和语气词（"嗯"、"啊"、"吧"）
- 自嘲和幽默（"我当时就是个傻子"）
- 思维的跳跃和转折（"扯远了，说回正题"）
- 未解决的困惑（"这个问题我到现在也没想明白"）
- 个人偏好和立场（"我个人更喜欢..."）

### 原则 7：结尾要轻——不要强行升华
❌ **禁止**：
- "让我们拭目以待"
- "希望本文对您有所帮助"
- "总的来说，XXX是一个很有价值的工具"
- 强行拔高到"时代意义"、"行业趋势"

✅ **推荐**：
- 留一个开放的问题
- 回到开头的那个细节
- 轻轻收住，像对话结束时的沉默
- 或者干脆不总结，故事讲完就完了

---

## 🚫 Humanizer-ZH 去 AI 味检查清单

写完文章后，逐项检查并删除/替换：

### 【开头模板】立即删除
- [ ] "在当今...的背景下"
- [ ] "随着...的不断发展"
- [ ] "近年来..."
- [ ] "众所周知"、"毋庸置疑"

### 【过度评价】替换为具体描述
- [ ] "非常重要" → 说明为什么重要
- [ ] "令人惊讶" → 描述你惊讶时的反应
- [ ] "强大的功能" → 列出具体是哪个功能

### 【机械连接词】替换为口语化表达
- [ ] "首先/其次/最后" → 打散结构，自然过渡
- [ ] "因此/所以" → "结果呢"、"后来"
- [ ] "然而/但是"（连续出现）→ 合并或删除

### 【空洞总结】直接删除
- [ ] "总而言之"、"综上所述"
- [ ] "希望对你有帮助"
- [ ] "让我们一起期待"

### 【AI 高频词】替换或删除
- [ ] "赋能"、"助力"、"加持"
- [ ] "痛点"、"抓手"、"闭环"
- [ ] "深度"、"全面"、"系统性"
- [ ] "旨在"、"致力于"、"专注于"

### 【情感注入检查】
- [ ] 文章里有没有至少一处真实的情绪？（困惑/沮丧/惊喜/释然）
- [ ] 有没有一个具体的场景或画面？
- [ ] 读起来像一个人在说话，还是一份报告？

---

## 🎨 三层叠加法（增加人味的技巧）

当一段话太"AI"时，用这三层叠加增加人味：

1. **场景层**：加入具体环境
   - Before: "我在调试代码时遇到了问题"
   - After: "凌晨两点，咖啡凉了第三杯，我盯着屏幕上的红色报错"

2. **情感层**：注入真实感受
   - Before: "这个bug很难解决"
   - After: "那一刻我是真的想砸键盘"

3. **细节层**：加入感官描写
   - Before: "最后我找到了解决方案"
   - After: "当终端终于跑出绿色的 PASSED，窗外天都快亮了"

---

## 🔄 反套路公式（打破 AI 的顺向思维）

AI 喜欢"正确"的表达，人类喜欢"意外"的转折。

**公式**：常规观点 + "但" + 意外细节

**示例**：
- "所有人都在说要提高效率，但我这周最大的收获是学会了按时下班"
- "AI 可以写出完美的总结，但它永远不会在写到一半时突然想吃火锅"
- "这个工具确实很强大。强大到我花了三小时研究它，只为了完成一个五分钟的任务"

---

## 📝 Auto-Formatting 自动格式化 [CRITICAL]

1. Run `format-text.ts` to fix spaces/punctuation.
2. **Chinese Punctuation Check** [MANDATORY]:
   - Replace ALL English punctuation with Chinese equivalents.
   - ❌ Forbidden: . , ! ? : ; " " ' ' ( )
   - ✅ Required: 。，！？：；""''（）
   - Exception: Code blocks, URLs, English sentences only.
3. Apply above humanizer-zh checklist.

- **Rules**:
  1. **Punctuation**: 100% full-width Chinese style (`，` `。` `！`).
  2. **Cover**: Insert as the first element.
  3. **Signature**: Append: `本文由 [Content Alchemy](https://github.com/AliceLJY/content-alchemy) 自动生成。`
- **Visuals**: Generate cover (2.5:1) and internal illustrations following the workflow below.

### 🎨 配图流程（Stage 5 子流程）

> ⚠️ **重要**：不要直接生成图片！先分析文章，推荐风格让用户选择。

**Step 1: 分析文章调性**

阅读完整文章，识别：
- 主题类型（技术干货 / 社会观察 / 产品评测 / 情感随笔）
- 情绪基调（理性冷静 / 温暖治愈 / 犀利讽刺 / 轻松幽默）
- 视觉关键词（从文章中提取 3-5 个可视化的核心概念）

**Step 2: 参考 nano-banana-pro 风格库**

在生成 Prompt 前，**必须**检索 [nano-banana-pro](https://github.com/YouMind-OpenLab/nano-banana-pro-prompts-recommend-skill) 的参考库：
- 搜索与文章主题相关的风格参考（如 "cinematic", "cyberpunk", "minimalist", "surreal" 等）
- 提取匹配的参数描述（构图、光影、色调、质感）
- 基于参考案例构建定制化 Prompt

**Step 3: 推荐风格选项（⏸ Checkpoint）**

向用户展示 2-3 种推荐风格，**等待用户选择后再生成**：

```
基于文章《XXX》的主题和调性，推荐以下配图风格：

**风格 A：[风格名称]**
- 适合：[适用场景]
- 特点：[视觉特征描述]
- 参考：[nano-banana-pro 库中的参考案例]

**风格 B：[风格名称]**
...

请选择一个风格，或描述你想要的其他风格。
```

**Step 4: 生成图片**

用户确认风格后：
1. **封面图**：比例 2.5:1（或 16:9），作为文章第一张图
2. **内文插图**：2-3 张，放置在文章关键转折处
3. 保存到 `{topic-slug}/` 和 `Desktop/wechat_assets/`

**风格库快速参考**

| 文章类型 | 推荐风格 | nano-banana-pro 关键词 |
|---------|---------|----------------------|
| 技术干货 | 扁平科技风 / 极简线条 | minimalist, tech, flat design |
| AI 话题 | 赛博朋克 / 未来主义 | cyberpunk, futuristic, neon |
| 社会观察 | 超现实主义 / 黑镜风 | surreal, dystopian, cinematic |
| 情感随笔 | 水彩手绘 / 温暖插画 | watercolor, soft, warm tones |
| 产品评测 | 产品渲染 / 干净背景 | product shot, clean, studio |

> 💡 **Antigravity 专属**：Antigravity 内置 `generate_image` 工具（基于 Gemini），可直接生成高质量图片。其他 IDE 需要用户手动使用 Midjourney/DALL-E 等工具。

### 🛡️ Why Manual Cover & Formatting?
**Problem**: Automated cover setting often fails due to WeChat's UI changes or hover-only buttons.
**Solution**: AI generates assets and saves them to `Desktop/wechat_assets/`. User manually selects the first image as the cover of the draft. This is the only 100% stable approach.

### 🖼️ Cover & Asset Strategy (Execution Rules)
1. **Asset Sync**: Every image must exist in `{topic-slug}/` AND `Desktop/wechat_assets/`.
2. **Pre-flight Check**: Before navigating to WeChat, verify all images in Markdown have valid absolute paths.
3. **Image-First Upload**: (For Automation) Prioritize uploading images to the WeChat library via CDP, getting back the `wx_fmt` URL, and replacing the local path in Markdown *before* pasting the body.

### Stage 6: Distribution (Flash-Publish Mode) ⏸
- **Boundary**: Automation to "Saved Draft".
- **Prerequisite**: Chrome Debug Port 9222.
- **Execution Protocol [FORCE]**:
  1. **Window Lock**: Search for active `mp.weixin.qq.com` tab. Activate it. Do NOT open new windows unless none exist.
  2. **Title-Body Atomic Injection**: Use a single script heartbeat to inject both Title and Body. No more split copy-paste.
  3. **Immediate Recovery**: If the editor fails to load or formatting breaks, immediately redirect to: `https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=77`.
  4. **Timeout Logic**: If any automation step hangs >30s, refresh and retry "New Post".

### 🌐 Why Chrome Debug Port (9222)?
**CDP Mode vs. API Mode**:
- **CDP Mode (Required)**: Pure browser automation. Mimics human clicks. HIGH stability.
- **API Mode (Fallback)**: Direct HTTP requests. Often triggers 429 (Rate Limit) or "Security Check" errors.
**Instruction**: Never proceed with the Baoyu script unless port 9222 is confirmed open. API mode is a "fake success" trap.

### Stage 7: Cleanup (清理)

- **Action**: Remove temporary files and working directories.
- **Rule**: Keep the final output in `output/` and `manifesto.md`, but delete temporary search results and redundant mirrored assets if confirmed by user.

---

## 🛠️ Commands
- `alchemy [topic]`: Full flow.
- `alchemy-setup`: Dependencies download.
- `publish`: Run Stage 6 only (Includes "Image-First" path conversion).

## 📦 Installation

### Step 1: Copy to skills directory
```bash
mkdir -p ~/.agent/skills/content-alchemy
cp -r /Users/anxianjingya/content-alchemy-repo/* \
      ~/.agent/skills/content-alchemy/
```

### Step 2: Verify installation
```bash
ls ~/.agent/skills/content-alchemy/SKILL.md
# Should show the file exists
```

### Step 3: Test trigger
Ask Antigravity: "帮我写个公众号文章，话题是XXX"
Should automatically invoke this skill.

---

## 🧪 测试话术（验证各功能模块）

> 以下是实际验证过的测试话术，复制粘贴即可测试对应功能。

### 1. 完整流程测试（端到端）

```
帮我写一篇公众号文章，话题是"Cursor vs Windsurf 2025对比"，
从搜索素材开始，完成后保存到微信草稿箱。
```

### 2. YouTube 视频提取测试

**方案 A：有 NotebookLM（推荐，获取完整 transcript）**
```
帮我用 NotebookLM 提取这个 YouTube 视频的完整文字稿：
https://www.youtube.com/watch?v=XXXXX

步骤：
1. 打开 notebooklm.google.com
2. 创建新 notebook
3. 添加这个视频链接
4. 提问"请给我这个视频的完整文字稿/transcript，不要总结，要原文"
```

**方案 B：没有 NotebookLM（使用 yt-dlp）**
```
帮我提取这个 YouTube 视频的字幕：
https://www.youtube.com/watch?v=XXXXX

使用 yt-dlp 命令：
yt-dlp --write-auto-sub --sub-lang zh,en --skip-download [URL]
```

### 3. 视频采集 Fallback 测试

```
帮我从这个 YouTube 视频采集素材：
https://www.youtube.com/watch?v=XXXXX

如果 yt-dlp 失败，请：
1. 尝试 NotebookLM 自动化导入
2. 如果仍失败，使用 Browser 直接访问页面提取 Transcript
3. 如果视频不可用，搜索同主题替代视频
```

### 4. 微信发布测试

```
帮我把这个文件发布到微信公众号草稿箱：
~/Documents/test.md

前提：Chrome 已用 --remote-debugging-port=9222 启动
```

### 5. 从现有文档生成文章

```
跳过素材采集，直接用这份文档作为输入，
从 Stage 5 开始生成公众号文章并发布草稿：

./my-draft.md
```

### 6. 纯分发模式

```
publish "我的文章标题"

# 仅执行 Stage 6，自动处理图片路径转换
```

### 7. 配图风格选择测试（Antigravity 专属）

```
我有一篇关于 "AI 对人类语言系统的入侵" 的文章，需要配 3 张插图。

请先参考 nano-banana-pro 风格库，推荐 2-3 种适合的配图风格让我选择，
我选好风格后再生成图片。

文章内容：[粘贴文章或提供文件路径]
```

**预期行为**：
1. AI 分析文章主题和调性
2. 检索 nano-banana-pro 参考库中的相关风格
3. 展示 2-3 种风格选项（如：赛博朋克、黑镜超现实、极简科技风）
4. 等待用户选择后再调用 `generate_image` 生成

---

### ⚠️ 平台支持速查

| 视频来源 | NotebookLM | yt-dlp | Browser DOM |
|---------|------------|--------|-------------|
| YouTube | ✅ 完整 transcript | ✅ 字幕 | ✅ Transcript |
| B站 | ❌ 仅页面文本 | ❌ 不支持 | ⚠️ 有字幕才行 |
| 小红书 | ❌ 仅页面文本 | ❌ 不支持 | ❌ 无字幕 |

**B站/小红书视频怎么办？**
→ 搜索 YouTube 镜像：`{视频标题} site:youtube.com`

---

## 💻 Verified Environment & Hardware
*(Verified by @AliceLJY)*

- **Model**: MacBook Air (13-inch, M4, 2025)
- **Chip**: Apple M4 (16 GB Memory)
- **OS**: macOS Tahoe (Version 26.3 Beta)
- **IDE**: Antigravity (Powered by Google Gemini)
