#!/bin/bash

echo "🔍 Content Alchemy Environment Check"
echo "===================================="
echo ""

# Check 1: Bun
echo "📦 Checking Bun..."
if command -v bun &> /dev/null; then
    BUN_VERSION=$(bun --version)
    echo "   ✅ Bun installed: v$BUN_VERSION"
else
    echo "   ❌ Bun not found"
    echo "   → Install: curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# Check 2: Chrome Debug Port
echo ""
echo "🌐 Checking Chrome Debug Port..."
if lsof -i :9222 &> /dev/null; then
    echo "   ✅ Chrome debug port (9222) is open"
else
    echo "   ⚠️  Chrome debug port not detected"
    echo "   → Chrome 144+ 需要非默认 user-data-dir 才能绑定调试端口"
    echo "   → 启动命令："
    echo "     /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222 --user-data-dir=\"\$HOME/chrome-debug-profile\" &"
    echo "   → 注意：必须先完全退出 Chrome（Cmd+Q），再用上述命令启动"
fi

# Check 3: Baoyu Dependencies
echo ""
echo "📚 Checking Baoyu Scripts..."

# Check multiple possible locations
BAOYU_FOUND=false
BAOYU_LOCATIONS=(
    "dependencies/baoyu-skills/skills/baoyu-post-to-wechat/scripts/wechat-article.ts"
    "$HOME/.gemini/skills/baoyu-post-to-wechat/scripts/wechat-article.ts"
    "$HOME/.gemini/antigravity/scratch/baoyu-skills/skills/baoyu-post-to-wechat/scripts/wechat-article.ts"
)

for path in "${BAOYU_LOCATIONS[@]}"; do
    if [ -f "$path" ]; then
        echo "   ✅ Baoyu scripts found at: $path"
        BAOYU_FOUND=true
        break
    fi
done

if [ "$BAOYU_FOUND" = false ]; then
    echo "   ❌ Baoyu scripts not found in any expected location"
    echo "   → Option 1 (Local): git clone https://github.com/JimLiu/baoyu-skills.git dependencies/baoyu-skills"
    echo "   → Option 2 (Global): Already installed via Antigravity Skills"
    exit 1
fi

# Check 4: Git
echo ""
echo "🔧 Checking Git..."
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo "   ✅ $GIT_VERSION"
else
    echo "   ❌ Git not found"
    echo "   → Install via Xcode Command Line Tools or https://git-scm.com/"
fi

# Check 5: yt-dlp (Optional)
echo ""
echo "🎬 Checking yt-dlp (optional)..."
if command -v yt-dlp &> /dev/null; then
    YTDLP_VERSION=$(yt-dlp --version)
    echo "   ✅ yt-dlp installed: v$YTDLP_VERSION"
else
    echo "   ⚠️  yt-dlp not found (optional, for YouTube subtitle extraction)"
    echo "   → Install: brew install yt-dlp"
fi

# Check 6: npm Dependencies (for Baoyu scripts)
echo ""
echo "📦 Checking npm dependencies..."
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REQUIRED_MODULES=("front-matter" "highlight.js" "reading-time" "markdown-it" "fflate" "katex" "marked")
MISSING_MODULES=()

for mod in "${REQUIRED_MODULES[@]}"; do
    if [ -d "$PROJECT_DIR/node_modules/$mod" ]; then
        echo "   ✅ $mod"
    else
        echo "   ❌ $mod missing"
        MISSING_MODULES+=("$mod")
    fi
done

if [ ${#MISSING_MODULES[@]} -gt 0 ]; then
    echo ""
    echo "   ⚠️  Missing npm dependencies! Run:"
    echo "   → cd $PROJECT_DIR && bun install"
fi

# Check 7: Project Structure
echo ""
echo "📁 Checking Project Structure..."
REQUIRED_FILES=("SKILL.md" "README.md" "SETUP.md" "scripts/format-text.ts" "scripts/setup.sh")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file missing"
    fi
done

echo ""
echo "===================================="
echo "✅ Environment check complete!"
echo ""
echo "💡 Next steps:"
echo "   1. If Chrome port is closed, run: chrome-debug"
echo "   2. Login to WeChat Official Accounts Platform"
echo "   3. Test with: alchemy \"测试主题\""
