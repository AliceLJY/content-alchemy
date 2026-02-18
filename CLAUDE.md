# Content Alchemy — Claude Code 项目记忆

> 本文件供 Claude Code 每次启动时自动读取，避免重复踩坑。

## 项目概述

- **工作流定义**：`SKILL.md`（7 阶段内容炼金术），必须严格按流程执行
- **公众号**：ai照见众生（四个板块：AI实操手账、AI随心分享、AI照见众生、AI踩坑实录）
- **作者人设**：医学出身，文化口饭碗，AI 是野路子。不贩卖焦虑，不兜售答案

## 踩坑清单（每次必读）

### Stage 3.5：交叉验证（v4.1 新增）

- **"有来源"≠"数据对"**：Stage 3 的 Truth Table 只验证来源权威性。Stage 3.5 验证**数据本身是否正确**，通过交叉印证拦截错误
- **实际翻车案例（2026-02-11）**：
  - "中国每年60万人过劳死，全球第一" → 实际：心源性猝死约54.4万，"过劳死"无官方统计，无"全球第一"权威数据
  - "华为手表能检测房颤" → 实际：需指定具体型号（GT4/Watch 4 Pro），且需 NMPA 认证
  - 影视剧情细节 → AI "回忆"极不可靠，必须对照豆瓣/维基，只引用核心设定
- **绝对化表述必须警惕**："全球第一""最""唯一""每年XX万"这种掷地有声的数据，恰恰是最需要 triple-check 的
- **模板文件**：`templates/cross-reference-report.md`
- **Bot 版**：v2.1 同步增加了自动交叉验证决策规则

### Stage 5：文章格式 + 配图

- **标题不要写两次**：frontmatter 有 `title:` 就**不要**在 body 里再写 `# 标题`。baoyu 脚本从 frontmatter 提取 title 填到微信标题栏，但不去掉 body 里的 H1 → 两边都写 = 标题重复（2026-02-13 踩坑确认）
- **图片格式必须用 Markdown 语法**：article.md 里的图片必须写 `![alt](path)`，**禁止**直接写 `WECHATIMGPH_x` 占位符。占位符是脚本内部的中间产物，脚本通过正则匹配 `![]()`  来发现图片并自动生成占位符。直接写占位符会导致 `Found 0 images to insert`，图片全部丢失
- **图片位置**：`![alt](path)` 必须嵌入正文对应位置——封面图紧跟标题后，插图放章节转折处。**禁止堆在文末**
- **nano-banana-pro**：生图前必须主动询问用户是否要用 `nano-banana-pro-prompts-recommend-skill` 优化 Prompt，不能默默跳过
- **图片生成工具（2026-02-02 更新）**：
  - 使用 `bun scripts/gemini-image-gen.ts --prompt "..." --output path.png`
  - 自动模式：先尝试 API（`baoyu-danger-gemini-web`），失败则自动切换 CDP 浏览器模式
  - CDP 模式需 Chrome 调试端口 9222（脚本会自动启动或复用已有 Chrome）
  - Chrome 144+ 要求：`--remote-debugging-port=9222 --user-data-dir="$HOME/chrome-debug-profile"`
  - **已知问题**：Google Gemini API 响应格式不稳定，API 模式可能随时失效，此时 CDP 模式为唯一可靠方案
  - **CDP 下载方式（2026-02-02 修复）**：模拟 hover 图片并点击下载按钮，从 Downloads 目录获取下载文件。直接 fetch googleusercontent URL 会返回 403

### Stage 6：发布

- **两套发布方案**（2026-02-18 新增 API 模式）：
  - **API 模式（首选）**：`bun ./dependencies/baoyu-skills/skills/baoyu-post-to-wechat/scripts/wechat-api.ts <article.md> --author "小试AI" --cover <cover.png>`。纯 HTTP，不需要 Chrome，适合 Bot 和无人值守
  - **浏览器模式（兜底）**：`bun ./dependencies/baoyu-skills/skills/baoyu-post-to-wechat/scripts/wechat-article.ts --markdown <file> --theme <theme>`。需要 Chrome，仅在 API 未配置时使用
  - **判断规则**：检查 `~/.baoyu-skills/.env` 是否有 `WECHAT_APP_ID`，有则 API，没有则浏览器
- **API 模式配置**：`~/.baoyu-skills/.env` 需要 `WECHAT_APP_ID` 和 `WECHAT_APP_SECRET`，微信公众平台 IP 白名单需添加本机出口 IP
- **API 模式 IP 白名单报错**：`40164 invalid ip` → 错误信息里带实际 IP，让用户去公众平台白名单补上
- **禁止**直接调用 `baoyu-post-to-wechat` skill（它不知道 Content Alchemy 的上下文）
- **浏览器模式注意事项**（仅兜底时参考）：
  - Chrome 复用：cdp.ts 自动检测已有调试端口并复用
  - 焦点抢占：发布过程中剪贴板操作会抢焦点，提醒用户不要切换窗口
  - 多标签焦点错位：连续发布多篇时，每篇发完顺手关掉编辑器标签
- **发布完成后**：脚本输出成功后，必须**立刻回复用户**进入 Checkpoint 确认，不要继续自行操作
- **占位符格式**：baoyu v1.23.0 已将占位符从 `[[IMAGE_PLACEHOLDER_x]]` 改为 `WECHATIMGPH_x`

### 代码质量（v4.1 评审改进）

- **publish.sh 路径**：`PROJECT_DIR` 和 `BAOYU_SCRIPT` 已改为基于脚本自身位置自动检测，不再硬编码绝对路径
- **gemini-image-gen**：v1 和 v2 已合并为单一文件，v2 已删除。保留 `--method auto|api|cdp` 参数
- **package.json**：已添加 `name`、`version`、`scripts` 等项目元数据
- **tsconfig.json**：已添加适配 Bun 的 TypeScript 配置
- **setup.sh**：Chrome alias 已添加 `--user-data-dir` 参数（Chrome 144+ 必需）
- **simple-md-to-html.ts**：已移除未使用的 `createHash` import

### 文档维护

- **中英文同步**：每次改 README.md 必须同步更新 README-EN.md，一起提交
- **改了就推**：每次修改都要提交到 GitHub，不要攒着

## 环境信息

- **Hardware**: MacBook Air M4, 16GB
- **System**: macOS Tahoe
- **IDE**: Claude Code (Opus 4.5) 主力 / Antigravity (Gemini) 测试
- **Chrome**: 144+（调试端口行为已变）
- **npm 依赖**：baoyu-skills 作为 git submodule 无自己的 package.json，宿主项目 package.json 必须包含所有依赖
- **baoyu-skills 版本**：v1.28.0（2026-02-02 更新）
