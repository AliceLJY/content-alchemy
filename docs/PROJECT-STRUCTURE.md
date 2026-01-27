# 📁 项目结构说明

> 💡 **给新手的话**: 这个文件帮你了解项目里各个文件是干什么的，哪些重要，哪些可以忽略。

---

## 📚 核心文档（必读）

这些是你需要阅读的文档：

```
📖 README.md              项目总览 - 从这里开始
📘 SETUP.md              完整安装指南
📙 BEGINNER-GUIDE.md     新手补充指南（不懂技术？看这个）
📕 SKILL.md              Alchemy 工作流技术文档
📮 WECHAT-PUBLISH.md     微信公众号发布指南
📄 PROJECT-STRUCTURE.md  项目结构说明（本文件）
```

---

## 🛠️ 核心脚本（常用工具）

### 用户常用脚本

```
scripts/
├── publish.sh              🚀 微信发布脚本（主要使用这个）
├── setup.sh                ⚙️  初始化安装脚本
└── doctor.sh               🔍 项目健康检查脚本
```

**使用方法**:

```bash
# 发布文章到微信
bash scripts/publish.sh ./your-article.md

# 检查项目配置
bash scripts/doctor.sh

# 初始化安装（仅首次）
bash scripts/setup.sh
```

---

### 内部脚本（自动调用，无需手动运行）

```
scripts/
├── simple-md-to-html.ts        Markdown 转 HTML 转换器
├── format-text.ts              文本格式化工具
├── preprocess_article.py       文章预处理脚本
└── fix-baoyu-dependencies.sh   Baoyu 依赖修复脚本
```

> 💡 这些脚本会被 `publish.sh` 自动调用，你不需要单独运行它们。

---

## 📂 内容目录

### ai-agent-content-creation/

这是 Alchemy 工作流生成的示例内容：

```
ai-agent-content-creation/
├── manifesto.md                      Stage 1: 选题灵感
├── mining-report.md                  Stage 2: 素材采集报告
├── source-extraction-report.md       Stage 3: 源提取报告
├── source-truth-table.md             Stage 4: 真实性核查表
├── wechat-article-formatted.md       Stage 5: 微信格式文章
└── *.png                             Stage 5: 配图
```

**用途**:
- 学习 Alchemy 工作流的输出格式
- 测试发布脚本
- 作为模板参考

---

### mock-test/

测试用的模拟文章，用于验证发布功能。

---

## 📦 配置和资源

```
assets/
└── wechat_qr.jpg          微信公众号二维码

.archive/
└── old-scripts/           已归档的旧脚本（可忽略）
```

---

## 🔧 隐藏目录（自动生成，无需关心）

```
.gemini/              Antigravity 配置（自动管理）
node_modules/         依赖包（自动安装）
.git/                 Git 版本控制（自动管理）
```

> ⚠️ 这些目录不要手动修改，除非你知道自己在做什么。

---

## 📊 完整目录树

```
content-alchemy-repo/
│
├── 📚 文档
│   ├── README.md                     项目总览
│   ├── SETUP.md                      安装指南
│   ├── BEGINNER-GUIDE.md             新手指南
│   ├── SKILL.md                      技术文档
│   ├── WECHAT-PUBLISH.md             微信发布指南
│   └── PROJECT-STRUCTURE.md          项目结构（本文件）
│
├── 🛠️ 脚本
│   └── scripts/
│       ├── publish.sh                微信发布（主要使用）
│       ├── setup.sh                  安装脚本
│       ├── doctor.sh                 健康检查
│       ├── simple-md-to-html.ts      Markdown 转换
│       ├── format-text.ts            格式化工具
│       ├── preprocess_article.py     预处理脚本
│       └── fix-baoyu-dependencies.sh 依赖修复
│
├── 📂 内容示例
│   ├── ai-agent-content-creation/    Alchemy 示例输出
│   │   ├── manifesto.md              选题灵感
│   │   ├── mining-report.md          素材采集
│   │   ├── source-extraction-report.md 源提取
│   │   ├── source-truth-table.md     真实性核查
│   │   ├── wechat-article-formatted.md 微信文章
│   │   └── *.png                     配图
│   └── mock-test/                    测试文章
│
├── 📦 资源
│   ├── assets/                       图片资源
│   └── .archive/                     已归档文件
│
└── 🔧 配置（自动生成）
    ├── .gemini/                      Antigravity 配置
    ├── node_modules/                 依赖包
    └── .git/                         版本控制
```

---

## 🎯 常见使用场景

### 场景 1: 我想发布一篇文章到微信

1. 准备好文章（Markdown 格式）和图片
2. 运行 `bash scripts/publish.sh ./your-article.md`
3. 查看 [WECHAT-PUBLISH.md](./WECHAT-PUBLISH.md) 获取详细步骤

---

### 场景 2: 我想了解 Alchemy 工作流

1. 阅读 [SKILL.md](../SKILL.md) 了解 7 阶段工作流
2. 查看 `ai-agent-content-creation/` 目录的示例输出
3. 参考 [README.md](./README.md) 的设计决策部分

---

### 场景 3: 我遇到问题了

1. 先运行 `bash scripts/doctor.sh` 检查项目状态
2. 查看 [BEGINNER-GUIDE.md](./BEGINNER-GUIDE.md) 的常见问题
3. 查看 [WECHAT-PUBLISH.md](./WECHAT-PUBLISH.md) 的故障排查
4. 在 GitHub Issues 提交问题

---

### 场景 4: 我想学习代码

**新手**: 先看 `scripts/publish.sh`，这是最简单的脚本

**进阶**: 查看 `scripts/simple-md-to-html.ts`，了解 Markdown 转换

**高级**: 查看 `.gemini/antigravity/scratch/baoyu-skills/`，了解 CDP 自动化

---

## 🗂️ 文件类型说明

### Markdown 文件 (.md)

- **文档**: README.md, SETUP.md 等
- **文章**: wechat-article-formatted.md
- **报告**: mining-report.md, source-truth-table.md

### Shell 脚本 (.sh)

- **Bash 脚本**: 用于自动化任务
- **需要执行权限**: `chmod +x script.sh`

### TypeScript 文件 (.ts)

- **Bun 运行**: `bun script.ts`
- **功能**: Markdown 转换、文本处理

### Python 脚本 (.py)

- **Python 运行**: `python3 script.py`
- **功能**: 文章预处理、格式转换

---

## 📏 文件大小参考

```
文档类           < 50KB    (README.md, SETUP.md)
脚本类           < 10KB    (publish.sh, setup.sh)
文章类           10-50KB   (wechat-article.md)
图片类           500KB-1MB (*.png)
```

如果文件大小异常，可能需要检查。

---

## 🔍 快速查找文件

### 查找所有 Markdown 文件

```bash
find . -name "*.md" -type f
```

### 查找所有脚本

```bash
find scripts/ -type f
```

### 查找所有图片

```bash
find . -name "*.png" -o -name "*.jpg" -type f
```

### 查找大文件（> 1MB）

```bash
find . -type f -size +1M
```

---

## 🧹 清理和维护

### 清理临时文件

```bash
# 清理 Chrome 临时数据
rm -rf /tmp/chrome-wechat

# 清理归档文件（如果确定不需要）
rm -rf .archive
```

### 重新安装依赖

```bash
# 删除依赖
rm -rf node_modules

# 重新安装
bash scripts/setup.sh
```

---

## 📝 总结

### 新手只需关心这些

- ✅ **README.md** - 了解项目
- ✅ **SETUP.md** - 安装配置
- ✅ **WECHAT-PUBLISH.md** - 发布文章
- ✅ **scripts/publish.sh** - 发布脚本

### 其他文件都是什么？

- 📚 **文档** - 提供指导和说明
- 🛠️ **脚本** - 自动化工具（大部分自动调用）
- 📂 **示例** - 学习和测试用
- 🔧 **配置** - 系统自动管理，不用管

---

*最后更新: 2025-01-25*
*版本: v3.1*
