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

### Q3: 图片没有上传成功
**这是已知限制**：
- 脚本会把文章内容发布成功
- 图片需要手动上传（从正文选图作为封面）
- 原因：微信编辑器的富文本过滤机制

### Q4: 文章格式丢失
**检查**：
- Markdown文件是否使用UTF-8编码？
- 使用的是`wechat-article.ts`（支持样式）而不是纯文本脚本？

---

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
