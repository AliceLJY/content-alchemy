# Content Alchemy v2.5 发布检查清单

## 📋 核心文件状态

### 必需文件
- [x] **SKILL.md** - 已更新到v2.5，移除PPT，添加Chrome端口说明
- [x] **README.md** - 已添加SETUP.md链接，更新避坑指南
- [x] **SETUP.md** - 新建，小白友好的完整安装指南

### 依赖说明
- [x] 明确标注需要`baoyu-skills`完整clone
- [x] Chrome调试端口要求写在醒目位置
- [x] 提供了alias设置简化操作

## 🔧 今日修复的问题

### Stage 2（Source Mining）
- [x] ✅ 新增：YouTube-First策略
- [x] ✅ 新增：素材真实性核查报告（表格输出）
- [x] ✅ 修复：B站451错误→自动切换YouTube

### Stage 5（Writing）
- [x] ✅ 移除：PPT生成环节（简化流程）
- [x] ✅ 新增：字数量化要求（避免"3000字标题1620字内容"）

### Stage 7（Distribution）
- [x] ✅ 修复：Fail-Safe逻辑（Exit!=0时STOP并报错）
- [x] ✅ 新增：Chrome端口前置检查
- [x] ✅ 文档：明确图片需手动上传（已知限制）

## 📚 新增文档

### SETUP.md包含
- [x] Bun安装（一键脚本）
- [x] 仓库clone指导
- [x] Baoyu依赖安装（到`dependencies/`目录）
- [x] Chrome启动方式（含alias配置）
- [x] 验证脚本（lsof检查端口）
- [x] 常见问题Q&A

### 技术复盘文章
- [x] 已保存到桌面：`Content_Alchemy_技术踩坑实录.md`
- [x] 8个核心问题完整记录
- [ ] 需删除"彩蛋"段落（用户不喜欢）

## 🚀 待办事项（发布前）

### 文档审查
- [ ] 检查SETUP.md中路径是否都正确
- [ ] 验证README中的链接是否有效
- [ ] 确认SKILL.md中没有过时信息

### 代码审查
- [ ] 检查是否有硬编码的个人路径
- [ ] 确认所有示例路径都用`~`或相对路径

### Git提交
- [ ] 添加`.gitignore`（排除临时文件）
- [ ] 提交message遵循规范
- [ ] 打tag v2.5

## 🎯 用户验收标准

### 小白能否复刻？
- [x] 文档是否step-by-step？
- [x] 是否有"一键复制"的命令？
- [x] 错误提示是否明确？

### 依赖是否清晰？
- [x] Baoyu仓库地址明确
- [x] 安装位置标准化（`dependencies/`）
- [x] 版本要求明确（Bun无特定版本要求）

### 已知限制是否声明？
- [x] 图片上传需手动
- [x] Chrome必须开调试端口
- [x] 仅支持macOS

## ✍️ 建议的Git Commit Message

```
feat: Content Alchemy v2.5 - Production Ready

Major improvements:
- YouTube-First mining to bypass Bilibili 451
- Truth-check reporting (no more fabrication)
- Fail-safe publishing (Chrome port validation)
- Complete SETUP.md for beginners
- Removed PPT generation (streamlined)

Breaking changes:
- Stage count: 9→7 (merged/removed redundant stages)
- Baoyu dependency: must clone to `dependencies/`

Fixes:
- Image placeholder filtering by WeChat editor
- Chrome port detection false positives
- Word count mismatch (enforced 3000+ chars)

Docs:
- Added SETUP.md (10-min quickstart)
- Updated README (prominent setup link)
- SKILL.md v2.5 (removed outdated references)
```

---

**状态**: ✅ 已完成，等待用户最终审核
