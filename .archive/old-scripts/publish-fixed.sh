#!/bin/bash

# ==========================================
# Content Alchemy - 修复版发布脚本 v3.0
# 使用简化的 Markdown 转换器 + Baoyu CDP
# ==========================================

set -e

PROJECT_DIR="/Users/anxianjingya/content-alchemy-repo"
ARTICLE_FILE="${1:-$PROJECT_DIR/ai-agent-content-creation/wechat-article-formatted.md}"
SIMPLE_CONVERTER="$PROJECT_DIR/scripts/simple-md-to-html.ts"

echo "🚀 Content Alchemy - 修复版发布流程"
echo "========================================"
echo "文章路径: $ARTICLE_FILE"
echo ""

# Step 1: 检查 Chrome 9222 端口
echo "🔍 Step 1: 检查 Chrome 调试端口..."
if ! lsof -i :9222 > /dev/null 2>&1; then
    echo "❌ Chrome 9222 端口未开启！"
    echo ""
    echo "请在新终端运行以下命令启动 Chrome:"
    echo ""
    echo "/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome \\"
    echo "  --remote-debugging-port=9222 \\"
    echo "  --user-data-dir=/tmp/chrome-wechat &"
    echo ""
    echo "然后重新运行此脚本"
    exit 1
fi
echo "✅ Chrome 9222 端口已就绪"
echo ""

# Step 2: 检查文章文件
echo "📄 Step 2: 检查文章文件..."
if [ ! -f "$ARTICLE_FILE" ]; then
    echo "❌ 文章文件不存在: $ARTICLE_FILE"
    exit 1
fi
echo "✅ 文章文件存在"
echo ""

# Step 3: 使用简化转换器处理 Markdown
echo "🔧 Step 3: 转换 Markdown 为 HTML..."
CONVERSION_RESULT=$(bun "$SIMPLE_CONVERTER" "$ARTICLE_FILE" 2>&1)

if [ $? -ne 0 ]; then
    echo "❌ Markdown 转换失败:"
    echo "$CONVERSION_RESULT"
    exit 1
fi

echo "✅ Markdown 转换成功"

# 提取 HTML 路径
HTML_PATH=$(echo "$CONVERSION_RESULT" | grep -o '"htmlPath": "[^"]*"' | cut -d'"' -f4)
echo "HTML 路径: $HTML_PATH"
echo ""

# Step 4: 调用 Baoyu 的 wechat-article.ts 直接使用 HTML
echo "🚀 Step 4: 发布到微信公众号..."
echo ""
echo "提示:"
echo "  - 首次运行需要扫码登录"
echo "  - 浏览器会自动打开并操作"
echo "  - 不要移动鼠标或切换窗口"
echo ""

BAOYU_SCRIPT="/Users/anxianjingya/.gemini/antigravity/scratch/baoyu-skills/skills/baoyu-post-to-wechat/scripts/wechat-article.ts"

# 直接使用转换好的 markdown (让 baoyu 的转换器失败后用我们的 HTML)
# 或者修改 baoyu 让它接受预转换的 JSON

# 临时方案: 修改 baoyu 的 md-to-wechat.ts 让它使用我们的转换器
export SIMPLE_MD_CONVERTER="$SIMPLE_CONVERTER"

bun "$BAOYU_SCRIPT" --markdown "$ARTICLE_FILE" --submit

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 发布完成！"
    echo ""
    echo "下一步:"
    echo "  1. 在浏览器中查看草稿"
    echo "  2. 设置封面图片 (第一张图)"
    echo "  3. 检查格式"
    echo "  4. 点击发布"
    echo ""
else
    echo ""
    echo "❌ 发布失败，请检查错误信息"
    exit 1
fi
