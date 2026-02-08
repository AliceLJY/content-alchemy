#!/bin/bash

# ==========================================
# Content Alchemy - 微信公众号发布脚本
# 版本: v3.1 (粘贴问题已修复)
# ==========================================

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ARTICLE_FILE="${1}"
BAOYU_SCRIPT="$PROJECT_DIR/dependencies/baoyu-skills/skills/baoyu-post-to-wechat/scripts/wechat-article.ts"

echo "📮 Content Alchemy - 微信发布"
echo "===================================="
echo ""

# 检查是否提供了文章路径
if [ -z "$ARTICLE_FILE" ]; then
    echo "❌ 请提供文章路径"
    echo ""
    echo "用法:"
    echo "  bash scripts/publish.sh ./你的文章.md"
    echo ""
    echo "示例:"
    echo "  bash scripts/publish.sh ./ai-agent-content-creation/wechat-article-formatted.md"
    exit 1
fi

# 转换为绝对路径
if [[ "$ARTICLE_FILE" != /* ]]; then
    ARTICLE_FILE="$PROJECT_DIR/$ARTICLE_FILE"
fi

echo "📄 文章路径: $ARTICLE_FILE"
echo ""

# Step 1: 检查 Chrome 9222 端口
echo "🔍 检查 Chrome 调试端口..."
if ! lsof -i :9222 > /dev/null 2>&1; then
    echo "❌ Chrome 9222 端口未开启！"
    echo ""
    echo "请先运行以下命令启动 Chrome:"
    echo ""
    echo "/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome \\"
    echo "  --remote-debugging-port=9222 \\"
    echo "  --user-data-dir=/tmp/chrome-wechat &"
    echo ""
    exit 1
fi
echo "✅ Chrome 调试端口已就绪"
echo ""

# Step 2: 检查文章文件
echo "📄 检查文章文件..."
if [ ! -f "$ARTICLE_FILE" ]; then
    echo "❌ 文章文件不存在: $ARTICLE_FILE"
    echo ""
    echo "请检查路径是否正确，或者使用以下命令查找文章:"
    echo "  find . -name '*.md' -type f"
    exit 1
fi
echo "✅ 文章文件存在 ($(du -h "$ARTICLE_FILE" | cut -f1))"
echo ""

# Step 3: 检查图片文件
ARTICLE_DIR=$(dirname "$ARTICLE_FILE")
IMAGE_COUNT=$(find "$ARTICLE_DIR" -name "*.png" -type f 2>/dev/null | wc -l | tr -d ' ')
if [ "$IMAGE_COUNT" -gt 0 ]; then
    echo "🖼️  找到 $IMAGE_COUNT 张图片"
else
    echo "⚠️  未找到图片文件（如果文章有图片，请确保图片在同一目录下）"
fi
echo ""

# Step 4: 检查 Baoyu 脚本
if [ ! -f "$BAOYU_SCRIPT" ]; then
    echo "❌ Baoyu 脚本不存在: $BAOYU_SCRIPT"
    echo ""
    echo "请确认 baoyu-skills 已正确安装"
    exit 1
fi

# Step 5: 调用 Baoyu 发布脚本
echo "🚀 开始自动发布..."
echo "===================================="
echo ""

bun "$BAOYU_SCRIPT" --markdown "$ARTICLE_FILE" --submit

if [ $? -eq 0 ]; then
    echo ""
    echo "===================================="
    echo "✅ 发布完成！"
    echo ""
    echo "📝 接下来请手动操作："
    echo "  1. 打开微信公众号后台"
    echo "  2. 找到刚保存的草稿"
    echo "  3. 设置封面图片（选择第一张图）"
    echo "  4. 检查文章格式和排版"
    echo "  5. 点击发布"
    echo ""
else
    echo ""
    echo "===================================="
    echo "❌ 发布失败"
    echo ""
    echo "🔧 排查建议："
    echo "  1. 检查 Chrome 窗口是否被关闭"
    echo "  2. 检查微信后台是否已登录"
    echo "  3. 查看上方错误信息"
    echo ""
    exit 1
fi
