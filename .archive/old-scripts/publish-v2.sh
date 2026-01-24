#!/bin/bash

# ==========================================
# Content Alchemy - 改进版发布脚本 v2.0
# 基于 Baoyu 的 Chrome CDP 方案
# ==========================================

set -e

PROJECT_DIR="/Users/anxianjingya/content-alchemy-repo"
ARTICLE_FILE="${1:-$PROJECT_DIR/ai-agent-content-creation/wechat-article-formatted.md}"
BAOYU_SCRIPT="/Users/anxianjingya/.gemini/antigravity/scratch/baoyu-skills/skills/baoyu-post-to-wechat/scripts/wechat-article.ts"

echo "📝 Content Alchemy - 发布流程"
echo "===================================="
echo "文章路径: $ARTICLE_FILE"
echo ""

# Step 1: 检查 Chrome 9222 端口
echo "🔍 检查 Chrome 调试端口..."
if ! lsof -i :9222 > /dev/null 2>&1; then
    echo "❌ Chrome 9222 端口未开启！"
    echo ""
    echo "请运行以下命令启动 Chrome:"
    echo "/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug"
    exit 1
fi
echo "✅ Chrome 9222 端口已就绪"
echo ""

# Step 2: 检查文章文件
echo "📄 检查文章文件..."
if [ ! -f "$ARTICLE_FILE" ]; then
    echo "❌ 文章文件不存在: $ARTICLE_FILE"
    exit 1
fi
echo "✅ 文章文件存在"
echo ""

# Step 3: 预处理文章（可选）
if [ -f "$PROJECT_DIR/scripts/preprocess_article.py" ]; then
    echo "🔧 预处理文章..."
    PROCESSED_FILE=$(python3 "$PROJECT_DIR/scripts/preprocess_article.py" "$ARTICLE_FILE" 2>&1)
    if [ $? -eq 0 ]; then
        echo "✅ 预处理完成: $PROCESSED_FILE"
        ARTICLE_FILE="$PROCESSED_FILE"
    else
        echo "⚠️  预处理失败，使用原文件"
    fi
    echo ""
fi

# Step 4: 调用 Baoyu 脚本
echo "🚀 调用 Baoyu 发布脚本..."
echo ""

if [ -f "$BAOYU_SCRIPT" ]; then
    # 使用 bun 运行 TypeScript
    bun "$BAOYU_SCRIPT" --markdown "$ARTICLE_FILE" --submit
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 发布完成！"
        echo "请在微信编辑器中："
        echo "  1. 设置封面图片"
        echo "  2. 检查格式"
        echo "  3. 点击发布"
    else
        echo ""
        echo "❌ 发布失败，请检查错误信息"
        exit 1
    fi
else
    echo "❌ Baoyu 脚本不存在: $BAOYU_SCRIPT"
    exit 1
fi
