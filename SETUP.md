# Content Alchemy 安装指南

> 本指南确保小白用户也能在10分钟内完成环境配置

## 📋 前置要求

### 必须安装
- **macOS** (当前仅支持Mac)
- **Google Chrome** 浏览器
- **Bun** 运行时环境

### 可选但推荐
- **Git** (用于更新Skill)

---

## ⚡ 快速安装（3步搞定）

### Step 1: 安装Bun运行时

在终端执行：
```bash
curl -fsSL https://bun.sh/install | bash
```

安装完成后，重启终端，验证安装：
```bash
bun --version
```

### Step 2: 克隆Content Alchemy仓库

```bash
cd ~/Documents  # 或你喜欢的任意目录
git clone https://github.com/AliceLJY/content-alchemy.git
cd content-alchemy
```

### Step 3: 下载Baoyu发布工具（必需）

```bash
# 在content-alchemy根目录下执行
git clone https://github.com/JimLiu/baoyu-skills.git dependencies/baoyu-skills
```

**路径说明：**
```
content-alchemy/
├── SKILL.md
├── README.md
└── dependencies/
    └── baoyu-skills/  ← 发布脚本在这里
        └── skills/
            └── baoyu-post-to-wechat/
                └── scripts/
                    └── wechat-article.ts
```

---

## 🔧 微信发布专用配置（重要！）

### Chrome调试模式启动

**每次使用前必须执行**：

```bash
# 完全关闭Chrome
pkill "Google Chrome"

# 以调试模式重启
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 &
```

**首次运行时**：
1. Chrome会弹出
2. 访问 https://mp.weixin.qq.com
3. 扫码登录你的公众号
4. **保持浏览器开着**，回到终端继续

**为什么需要这一步？**
Baoyu的脚本需要通过Chrome DevTools Protocol (CDP)控制浏览器。普通启动的Chrome不开放这个端口。

**可选：设置别名（一劳永逸）**

在`~/.zshrc`中添加：
```bash
alias chrome-debug="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 &"
```

之后只需输入：
```bash
chrome-debug
```

---

### 🔍 为什么Chrome调试端口是强制要求？

**问题：为什么不能用普通方式打开Chrome？**

因为Baoyu脚本需要通过**Chrome DevTools Protocol (CDP)**控制浏览器，这需要Chrome开放9222调试端口。

**两种模式对比：**

| 特性 | CDP模式（推荐） | API模式（已弃用） |
|------|----------------|-------------------|
| 启动要求 | 需要9222端口 | 无要求 |
| 稳定性 | ✅ 模拟真人操作 | ❌ 易被限流 |
| 失败表现 | 明确报错 | ⚠️ 假成功（显示Done但无草稿） |
| 速度 | 稍慢（真实点击） | 快（直接API调用） |
| 推荐度 | ⭐⭐⭐⭐⭐ | ⚠️ 不推荐 |

**常见错误案例：**

**案例1：假成功**
```bash
$ bun ./scripts/publish.ts
✅ Draft saved successfully!

# 但是：
- 浏览器窗口完全没动
- 微信后台没有草稿
- 原因：脚本走了API模式，微信返回429限流
```

**解决方法：**
```bash
# 1. 检查端口
lsof -i :9222

# 2. 如果没有输出，重启Chrome
pkill -9 "Google Chrome"
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 &

# 3. 重新运行脚本
```

**案例2：端口被占用**
```bash
Error: Address already in use
```

**解决方法：**
```bash
# 找到占用端口的进程
lsof -i :9222

# 杀掉进程
kill -9 [进程ID]

# 重新启动Chrome
```

---

## ✅ 验证安装

运行以下命令，确保所有依赖就绪：

```bash
# 检查Bun
bun --version

# 检查Baoyu脚本是否存在
ls dependencies/baoyu-skills/skills/baoyu-post-to-wechat/scripts/wechat-article.ts

# 检查Chrome调试端口（在启动Chrome后）
lsof -i :9222
```

**如果全部成功**：
```
✅ Bun: v1.x.x
✅ Baoyu脚本: 文件存在
✅ Chrome端口: 显示进程ID
```

---

## 🚀 首次运行测试

### 快速测试发布流程

1. 启动调试Chrome并登录微信
2. 在Antigravity/Claude中执行：

```
我有一篇Markdown文章在 ~/Documents/test.md，请帮我发布到微信公众号。

使用Content Alchemy的Stage 7流程，
文章路径：~/Documents/test.md
Baoyu脚本：~/Documents/content-alchemy/dependencies/baoyu-skills/skills/baoyu-post-to-wechat/scripts/wechat-article.ts
```

3. 如果成功，微信后台草稿箱会出现文章

---

## 🆘 常见问题

### Q1: "Module not found" 错误
**原因**：Baoyu依赖没有完整下载
**解决**：
```bash
cd content-alchemy/dependencies
rm -rf baoyu-skills
git clone https://github.com/JimLiu/baoyu-skills.git baoyu-skills
```

### Q2: Chrome报错"端口占用"
**原因**：上次的Chrome进程没关干净
**解决**：
```bash
pkill -9 "Google Chrome"
# 等3秒
/Applications/Google\ Chrome.app/.../Chrome --remote-debugging-port=9222 &
```

### Q3: 封面图如何设置？
**最佳实践（Workaround）**：
1. **正文置顶**：脚本会自动将生成的封面图插入到文章正文的**最顶部**。
2. **正常发布**：图片会随正文自动上传到微信素材库。
3. **手动收尾**：保存草稿后，点击“编辑”，直接**从正文选择**第一张图作为封面即可（无需再次上传）。

### Q4: 文章格式丢失
**检查**：
- Markdown文件是否使用UTF-8编码？
- 使用的是`wechat-article.ts`（支持样式）而不是纯文本脚本？

---

## 🆘 进阶问题排查

### Q5: 为什么需要列出硬件配置？

**答：坐标定位与屏幕分辨率强相关**

Stage 7使用的坐标（如`x: 90, y: 360`）是基于以下环境测试的：
- MacBook Air 13-inch (1440px 宽度)
- Chrome 100% 缩放
- macOS 默认字体大小

**如果你的配置不同：**
1. 坐标可能点不中目标按钮
2. 需要手动调整`wechat-article.ts`中的坐标值
3. 或者完全跳过自动化，手动操作

**为什么不用CSS选择器？**
- 微信编辑器的某些按钮是`display: none`
- 只有鼠标hover时才显示（`display: block`）
- CSS选择器无法定位隐藏元素
- 坐标是当前唯一可靠的方法

**未来改进方向：**
- [ ] 支持多分辨率自动适配
- [ ] 使用图像识别定位按钮
- [ ] 提供配置文件让用户自定义坐标

### Q6: 能否在非Antigravity环境使用？

**答：可以，但需要手动配图**

**完全兼容的功能：**
- ✅ Stage 1: Topic Mining
- ✅ Stage 2: Source Extraction  
- ✅ Stage 3: Truth Check
- ✅ Stage 4: Refining
- ✅ Stage 6: Writing
- ✅ Stage 7: Distribution

**需要手动处理的功能：**
- ⚠️ Stage 5: Image Generation
  - Antigravity: 有`generate_image`工具，全自动
  - Claude Code/Cursor: 无图像生成工具
  - **解决方案：**
    1. 用Midjourney/DALL-E生成图片
    2. 保存到`./images/cover.png`
    3. 在Markdown中引用：`![封面](./images/cover.png)`
    4. 跳过Stage 5，直接执行Stage 6

**启动命令：**
```bash
# Antigravity（全自动）
alchemy "AI算力危机"

# 其他IDE（需要先准备图片）
alchemy "AI算力危机" --skip-image-gen --cover ./images/cover.png
```

### Q7: 视频采集总是失败怎么办？

**症状：**
- B站视频搜到了，但提取不到字幕
- YouTube视频找不到对应内容

**排查步骤：**

**Step 1: 确认视频是否有字幕**
```bash
# 测试B站视频
# （需要安装 you-get 或 bilibili_api）
you-get -i [B站URL]

# 如果输出中没有"subtitle"字段 → 无字幕
```

**Step 2: YouTube镜像搜索**
```bash
# 1. 复制B站视频标题
# 2. 在YouTube搜索：[标题] site:youtube.com
# 3. 找到搬运视频

# 4. 提取字幕
yt-dlp --write-auto-sub --skip-download [YouTube URL]
```

**Step 3: 如果都没有字幕**
- 使用视频转录工具：Whisper / AssemblyAI
- 或者手动总结视频要点（跳过Stage 2，直接从Stage 6开始）

### Q8: 草稿保存成功但格式混乱

**症状：**
- 段落合并
- 引用符号丢失
- 图片位置错乱

**原因：**
- Markdown → 微信富文本 转换问题
- 全角/半角标点混用

**检查清单：**
1. **标点符号：**
   ```markdown
   # ❌ 错误（混用半角）
   今天，我们讨论AI(人工智能)的未来。

   # ✅ 正确（全部全角）
   今天，我们讨论AI（人工智能）的未来。
   ```

2. **段落换行：**
   ```markdown
   # ❌ 错误（单个换行）
   第一段内容。
   第二段内容。

   # ✅ 正确（双换行）
   第一段内容。

   第二段内容。
   ```

3. **图片路径：**
   ```markdown
   # ❌ 错误（绝对路径）
   ![](/Users/xxx/images/cover.png)

   # ✅ 正确（相对路径）
   ![封面](./images/cover.png)
   ```

**自动修复：**
```bash
# 使用格式化脚本（如果有的话）
bun ./scripts/format-markdown.ts ./output/article.md
```

## 📚 下一步

安装完成后，阅读：
- **SKILL.md**：完整的9阶段工作流说明
- **README.md**：Skill特性和设计理念
- **示例文章**：`/examples/`目录下的参考案例

---

## 🔄 更新Skill

```bash
cd ~/Documents/content-alchemy
git pull origin main

# 同时更新依赖
cd dependencies/baoyu-skills
git pull origin main
```

---

**准备就绪？开始你的第一次内容炼金之旅吧！** 🎉
