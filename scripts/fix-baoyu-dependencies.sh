#!/bin/bash

#==========================================
# Baoyu Post-to-WeChat 依赖修复脚本
# 解决 markdown 渲染器依赖缺失问题
#==========================================

set -e

BAOYU_MD_DIR="/Users/anxianjingya/.gemini/antigravity/scratch/baoyu-skills/skills/baoyu-post-to-wechat/scripts/md"

echo "🔧 修复 Baoyu Post-to-WeChat 依赖问题"
echo "========================================"
echo ""

# Step 1: 安装 markdown 渲染器依赖
echo "📦 Step 1: 安装 markdown 渲染器依赖..."
cd "$BAOYU_MD_DIR"

# 更新 package.json 添加缺失的依赖
cat > package.json << 'EOF'
{
  "name": "wechat-md-render",
  "dependencies": {
    "front-matter": "^4.0.2",
    "highlight.js": "^11.9.0",
    "marked": "^11.1.1",
    "reading-time": "^1.5.0",
    "fflate": "^0.8.1",
    "katex": "^0.16.9"
  }
}
EOF

echo "✅ package.json 已更新"
echo ""

# Step 2: 安装依赖
echo "📥 Step 2: 安装依赖包 (可能需要几秒钟)..."
bun install
echo "✅ 依赖安装完成"
echo ""

# Step 3: 测试转换功能
echo "🧪 Step 3: 测试 markdown 转换..."
TEST_MD="/Users/anxianjingya/content-alchemy-repo/ai-agent-content-creation/wechat-article-formatted.md"

if [ -f "$TEST_MD" ]; then
    echo "测试文件: $TEST_MD"
    bun "$BAOYU_MD_DIR/../md-to-wechat.ts" "$TEST_MD" > /tmp/baoyu-test-output.json 2>&1

    if [ $? -eq 0 ]; then
        echo "✅ Markdown 转换成功!"
        echo ""
        echo "转换结果:"
        cat /tmp/baoyu-test-output.json | head -20
    else
        echo "❌ 转换失败,错误信息:"
        cat /tmp/baoyu-test-output.json
        exit 1
    fi
else
    echo "⚠️  测试文件不存在,跳过测试"
fi

echo ""
echo "========================================"
echo "✅ 所有修复完成!"
echo ""
echo "下一步:"
echo "  1. 确保 Chrome 已在 9222 端口启动"
echo "  2. 运行: bash scripts/publish-v2.sh"
echo ""
