#!/bin/bash

# ==========================================
# 测试发布脚本 - 带详细日志
# ==========================================

set -e

PROJECT_DIR="/Users/anxianjingya/content-alchemy-repo"
ARTICLE_FILE="${1:-$PROJECT_DIR/ai-agent-content-creation/wechat-article-formatted.md}"
BAOYU_SCRIPT="/Users/anxianjingya/.gemini/antigravity/scratch/baoyu-skills/skills/baoyu-post-to-wechat/scripts/wechat-article.ts"

echo "🧪 测试发布流程"
echo "========================================"
echo ""

# 检查 Chrome
echo "✓ Chrome 9222 端口状态:"
if lsof -i :9222 > /dev/null 2>&1; then
    echo "  ✅ Chrome 运行中"
else
    echo "  ❌ Chrome 未运行"
    exit 1
fi
echo ""

# 检查文章
echo "✓ 文章文件:"
if [ -f "$ARTICLE_FILE" ]; then
    echo "  ✅ $ARTICLE_FILE"
else
    echo "  ❌ 文件不存在"
    exit 1
fi
echo ""

# 检查图片
echo "✓ 图片文件:"
PNG_COUNT=$(ls -1 "$PROJECT_DIR/ai-agent-content-creation/"*.png 2>/dev/null | wc -l | tr -d ' ')
echo "  ✅ 找到 $PNG_COUNT 个图片文件"
echo ""

# 测试转换
echo "✓ Markdown 转换测试:"
CONVERSION=$(bun /Users/anxianjingya/.gemini/antigravity/scratch/baoyu-skills/skills/baoyu-post-to-wechat/scripts/md-to-wechat.ts "$ARTICLE_FILE" 2>&1)
if echo "$CONVERSION" | grep -q '"title"'; then
    TITLE=$(echo "$CONVERSION" | grep '"title"' | cut -d'"' -f4)
    IMAGE_COUNT=$(echo "$CONVERSION" | grep -o 'IMAGE_PLACEHOLDER' | wc -l | tr -d ' ')
    echo "  ✅ 转换成功"
    echo "  标题: $TITLE"
    echo "  占位符: $IMAGE_COUNT 个"
else
    echo "  ❌ 转换失败"
    echo "$CONVERSION"
    exit 1
fi
echo ""

# 询问是否继续
echo "========================================"
echo "✅ 所有前置检查通过！"
echo ""
echo "准备发布到微信公众号:"
echo "  文章: $TITLE"
echo "  图片: $IMAGE_COUNT 张"
echo ""
echo "⚠️  注意:"
echo "  - 首次运行需要扫码登录"
echo "  - 浏览器会自动操作，请勿干扰"
echo "  - 发布后会保存为草稿"
echo ""
read -p "是否继续? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "取消发布"
    exit 0
fi
echo ""

# 运行发布
echo "🚀 开始发布..."
echo "========================================"
echo ""

bun "$BAOYU_SCRIPT" --markdown "$ARTICLE_FILE" --submit

echo ""
echo "========================================"
echo "✅ 发布流程完成！"
echo ""
echo "下一步:"
echo "  1. 在浏览器中打开微信公众号后台"
echo "  2. 查看草稿箱"
echo "  3. 选择第一张图作为封面"
echo "  4. 检查格式后发布"
echo ""
