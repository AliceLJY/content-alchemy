# Content Alchemy修改说明

已完成的修改：
1. ✅ P0-1: 添加trigger机制（行1-19）
2. ✅ P0-2: 添加Content Positioning（行55-59）

待完成的修改（请手动应用）：

## 修改3: Stage 4 - 替换"风格化表达"（第65行）

**原内容**
```
    - **风格化表达**: 鼓励使用具有"冲击力"的概念（如：叙事通货膨胀、原生苦难护城河），但要避免学术黑话的无意义堆砌。
```

**替换为**
```
    - **接地气表达**: 
        - ✅ 鼓励：生动的比喻、真实的案例、贴近生活的场景
        - ✅ 鼓励：冲击力概念（叙事通货膨胀、原生苦难护城河）
        - ❌ 禁止：学术黑话、晦涩理论、脱离现实的抽象讨论
        - ❌ 禁止：引用过多学术文献，应以媒体报道、个人经历为主
```

---

## 修改4: Stage 4 - 修改Output目标（第66行）

**原内容**
```
- **Output**: `{topic-slug}/manifesto.md` (目标: 成为该话题下的顶级思想评论)
```

**替换为**
```
- **Output**: `{topic-slug}/manifesto.md` (目标: 知识付费平台的爆款深度长文)
```

---

## 修改5: Stage 5 - PPT询问机制（第68-72行）

**原内容**
```markdown
### Stage 5: PPT Construction (建造) - Visual Presentation [OPTIONAL]

- **Action**: Decide if a visual presentation adds value. If yes, generate automatically.
- **Workflow**: Use `/nano-banana-pro-prompts-recommend-skill` & `generate_image`.
- **Output**: Multi-slide Web PPT via `npx serve`.
```

**替换为**
```markdown
### Stage 5: PPT Construction (建造) - Visual Presentation [OPTIONAL]

- **Decision Process** [ASK USER FIRST - MANDATORY]:
  
  **Step 1: Auto-assess topic suitability**
  ```
  Criteria for PPT recommendation:
  - ✅ 数据密集型话题 (有统计图表、对比数据)
  - ✅ 流程/步骤说明 (process/workflow explanation)
  - ✅ 教学培训类内容 (educational content)
  - ❌ 纯观点文章 (pure opinion piece)
  - ❌ 叙事性内容 (narrative storytelling)
  ```
  
  **Step 2: Ask user [MUST DO]**
  ```
  AI Message:
  "根据话题特征，这篇内容[推荐/不推荐]配合PPT演示。
  
  - 当前话题类型: {topic_type}
  - PPT适用场景: 演讲、培训、数据可视化
  
  是否生成PPT？
  1. 是，生成PPT (会增加2-3分钟)
  2. 否，跳过PPT，直接生成文章
  3. 你帮我决定
  "
  ```
  
  **Step 3: Execute based on response**
  - User选1 → 生成PPT后继续Stage 6
  - User选2 → 跳过Stage 5，直接Stage 6
  - User选3 → 根据Step 1的评估结果自动决定

- **Workflow**: Use `/nano-banana-pro-prompts-recommend-skill` & `generate_image`.
- **Output**: Multi-slide Web PPT via `npx serve`.

**Important**: Never skip asking unless user explicitly said "全自动模式". Default behavior = ASK (不是自动跳过).
```

---

## 修改6: Stage 6 - 中文标点+封面图（第74-80行）

**原内容**
```markdown
### Stage 6: Humanized Article (人性化写作) - WeChat-Ready Content

- **Goal**: Transform research paper into engaging, human-sounding article.
- **Style**: Follow the 7 Principles (Restrained intro, less evaluation, bold questions, etc.)
- **Auto-Formatting**: Run `format-text.ts` to fix spaces/punctuation automatically.
- **Visuals**: Auto-generate cover (2.5:1) and internal illustrations without asking.
- **Cover Placement [CRITICAL]**: **Always insert the cover image at the very top of the article.** This ensures it is uploaded to the WeChat platform as part of the content, making it selectable as the official cover without manual upload.
- **Output**: `{topic-slug}/wechat-article-formatted.md`.
```

**替换为**
```markdown
### Stage 6: Humanized Article (人性化写作) - WeChat-Ready Content

- **Goal**: Transform manifesto into engaging, human-sounding article for 知识付费平台 + 公众号.

- **Style**: Follow the 7 Principles (Restrained intro, less evaluation, bold questions, etc.)

- **Auto-Formatting** [CRITICAL - MANDATORY]:
  1. Run `format-text.ts` to fix Chinese/English spacing
  2. **Chinese Punctuation Check** [MUST DO]:
     - Replace ALL English punctuation with Chinese equivalents
     - ❌ Forbidden: . , ! ? : ; " " ' ' ( )
     - ✅ Required: 。，！？：；""''（）
     - Exception ONLY: Code blocks, URLs, pure English sentences
  3. Apply humanizer-zh rules (remove AI patterns)

- **Cover Image Generation**:
  - **Ratio**: 2.35:1 (WeChat Official Account standard)
  - **Dimensions**: 900px × 383px (EXACTLY)
  - **Prompt Template**: 
    ```
    [Content description...]
    
    TECHNICAL REQUIREMENTS:
    - Image dimensions: EXACTLY 900 pixels wide × 383 pixels tall
    - Aspect ratio: 2.35:1 (horizontal/landscape orientation)
    - Format: PNG
    - Composition: Keep important elements in center 80% (avoid edges)
    - Style: Clean, modern, suitable for WeChat article banner
    ```
  - **Save to**: `{topic-slug}/images/cover_wechat.png`

- **Cover Placement [CRITICAL - MUST FOLLOW]**:
  1. **Position**: Second element in markdown (immediately after H1 title)
  2. **Format Example**:
     ```markdown
     # {标题}
     
     ![{标题}](./images/cover_wechat.png)
     <!-- ⬆️ 封面图：此图片将作为微信公众号封面 -->\n     
     {正文开始...}
     ```
  3. **Path**: Use relative path `./images/`
  4. **Alt text**: 使用文章标题
  5. **Verification**: Confirm cover image is the FIRST image before proceeding

- **Internal Illustrations**: Auto-generate 2-3 internal images without asking.

- **Output**: `{topic-slug}/wechat-article-formatted.md`

**Quality Check Before Output**:
- [ ] 100% Chinese punctuation (except code/URLs)
- [ ] Cover image at position 2 (after title)
- [ ] Cover image dimensions 900×383px
- [ ] Relative paths for all images
- [ ] No AI writing patterns (humanizer-zh compliant)
```

---

## 修改7: Stage 7 - 草稿检测（第82-90行）

**原内容**
```markdown
### Stage 7: Distribution (分发) - Publish to Platform

- **Action**: Use `/baoyu-post-to-wechat`.
- **Smart Update (増量更新) [CRITICAL]**: 
    - **DO NOT** always create a new article.
    - **Step 1**: Go to the "Drafts" (草稿箱) screen.
    - **Step 2**: Search for an existing draft with the same title.
    - **Step 3**: If found, click to edit and replace content/images. Otherwise, create a new one.
- **Pre-publish Checklist**: Title validation, Image upload, Rich text conversion.
```

**替换为**
```markdown
### Stage 7: Distribution (分发) - Publish to Platform

- **Pre-flight Check** [NEW - MUST DO FIRST]:
  
  **Check 1: Browser State**
  ```
  - 读取当前打开的浏览器tabs
  - If 发现域名 mp.weixin.qq.com:
    - 检查URL是否包含 "appmsg_edit"
    - 检查页面标题是否 = 当前文章标题
    - If 完全匹配 → 询问用户："检测到已打开的编辑页面，是否复用？"
  ```
  
  **Check 2: Recent Draft Detection**
  ```
  - Navigate to: https://mp.weixin.qq.com/cgi-bin/appmsg (草稿箱)
  - 搜索标题匹配的草稿
  - If 找到 AND 更新时间 < 10分钟:
    - 询问用户："检测到{X}分钟前保存的草稿《{title}》，要继续编辑还是重新创建？"
    - Options:
      1. 复用草稿（更新内容）
      2. 创建新草稿
      3. 跳过发布（我已手动保存）
  ```

- **Action**: Use `/baoyu-post-to-wechat`.

- **Smart Update (増量更新) [ENHANCED]**:
  
  **Scenario A: 复用已打开页面**
  - 不打开新窗口
  - 复用当前编辑器
  - 更新内容 + 图片
  - 保存
  
  **Scenario B: 更新已有草稿**
  - 点击草稿进入编辑
  - 替换标题、内容、图片
  - 保存
  
  **Scenario C: 创建新草稿**
  - 点击"新建图文"
  - 填写内容
  - 保存
  
  **Scenario D: 用户已手动保存**
  - 验证草稿是否存在
  - 向用户报告："✅ 检测到草稿已保存，已跳过发布步骤"
  - 继续Stage 8

- **Pre-publish Checklist**: Title validation, Image upload, Rich text conversion.

- **Error Handling**:
  - If 403 during paste → 重试3次，每次间隔2秒
  - If selector not found → 截图 + 报告错误
```

---

## 完整修改后的SKILL.md文件

由于编辑器限制，我已创建了完整的修改说明文档。

**下一步**：
请手动应用修改3-7，或者告诉我你希望我：
1. 创建一个完整的新SKILL.md文件覆盖？
2. 还是继续尝试逐个修改？
