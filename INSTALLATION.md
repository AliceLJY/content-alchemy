# Content Alchemy - Installation & Testing

## ✅ 改进完成清单

### P0 - 核心修复（已完成）
1. ✅ **Skill触发机制** - 添加trigger关键词
2. ✅ **中文标点强制校正** - 在Stage 6明确要求100%中文标点
3. ✅ **封面图嵌入开头** - 明确格式和位置要求
4. ✅ **封面图比例精确控制** - 900×383px (2.35:1)

### P1 - 流程增强（已完成）
5. ✅ **PPT生成询问用户** - 必须先询问，不自动跳过
6. ✅ **草稿检测避免重复** - 检测10分钟内的同标题草稿

### P2 - 质量定位（已完成）
7. ✅ **内容定位调整** - 知识付费深度长文，紧扣实际生活，不探讨学术

---

## 📦 安装步骤

### Step 1: 复制到skills目录

```bash
# 复制完整文件到skills目录
cp /Users/anxianjingya/content-alchemy-repo/SKILL.md \
   /Users/anxianjingya/.agent/skills/content-alchemy/SKILL.md
```

### Step 2: 验证安装

```bash
# 检查文件是否存在
ls -lh /Users/anxianjingya/.agent/skills/content-alchemy/SKILL.md

# 应该显示文件大小约9KB
```

### Step 3: 测试触发

重启Antigravity后，尝试说：
```
"写个公众号文章，话题是数字游民"
```

应该自动触发content-alchemy skill。

---

## 🧪 测试清单

### 测试1: 自动触发
- [ ] 输入："写个公众号文章，话题是XXX"
- [ ] 预期：自动启动content-alchemy workflow

### 测试2: PPT询问
- [ ] workflow执行到Stage 5
- [ ] 预期：AI询问"是否生成PPT？"，提供3个选项

### 测试3: 中文标点
- [ ] 文章生成完成
- [ ] 检查`wechat-article-formatted.md`
- [ ] 预期：100%中文标点符号（。，！？：；""''）

### 测试4: 封面图位置
- [ ] 打开`wechat-article-formatted.md`
- [ ] 检查第2-3行
- [ ] 预期：
  ```markdown
  # 标题
  
  ![标题](./images/cover_wechat.png)
  <!-- ⬆️ 封面图：此图片将作为微信公众号封面 -->
  ```

### 测试5: 封面图尺寸
- [ ] 检查生成的封面图
- [ ] 使用命令：`sips -g pixelWidth -g pixelHeight {topic-slug}/images/cover_wechat.png`
- [ ] 预期：900×383 (误差<5px)

### 测试6: 草稿检测
- [ ] 手动保存一个草稿
- [ ] 10分钟内再次运行workflow
- [ ] 预期：AI询问"检测到X分钟前保存的草稿，要继续编辑还是重新创建？"

### 测试7: 内容质量
- [ ] 检查生成的manifesto.md
- [ ] 预期特征：
  - [ ] 有真实案例或生动比喻
  - [ ] 避免学术黑话
  - [ ] 紧扣实际生活
  - [ ] 有具体行动指南

---

## 📄 主要变更对比

| 项目 | 修改前 | 修改后 |
|------|--------|--------|
| **触发方式** | 需手动调用 | 自动触发（说"写公众号文章"） |
| **标点符号** | 未明确要求 | 强制100%中文标点 |
| **封面图比例** | 2.5:1（模糊） | 2.35:1 (900×383px精确) |
| **封面图位置** | "at the very top" | 第2行，带注释占位符 |
| **PPT生成** | "Decide... automatically" | 必须询问用户 |
| **草稿处理** | 搜索同名草稿 | 检测已打开页面+10分钟内草稿 |
| **内容定位** | "顶级思想评论" | "知识付费深度长文+紧扣实际" |

---

## 🚀 下一步

安装完成后，请：
1. 关闭并重启Antigravity
2. 运行一次完整测试（用一个简单话题）
3. 检查上述测试清单
4. 如有问题，查看生成的retrospective报告

---

**修改日期**: 2026-01-22  
**版本**: 2.0  
**修改者**: Antigravity AI
