#!/bin/bash

echo "🚀 Content Alchemy Setup Wizard"
echo "================================"
echo ""

# Step 1: Check if Bun is installed
echo "Step 1: Checking Bun..."
if ! command -v bun &> /dev/null; then
    echo "   Bun not found. Installing..."
    curl -fsSL https://bun.sh/install | bash
    echo "   ✅ Bun installed"
    echo "   ⚠️  Please restart your terminal and run this script again"
    exit 0
else
    echo "   ✅ Bun already installed"
fi

# Step 2: Clone Baoyu dependencies
echo ""
echo "Step 2: Downloading Baoyu scripts..."
mkdir -p dependencies
if [ -d "dependencies/baoyu-skills" ]; then
    echo "   ✅ Baoyu scripts already exist"
    echo "   Updating..."
    cd dependencies/baoyu-skills
    git pull origin main
    cd ../..
else
    cd dependencies
    git clone https://github.com/JimLiu/baoyu-skills.git
    cd ..
    echo "   ✅ Baoyu scripts downloaded"
fi

# Step 3: Setup Chrome alias
echo ""
echo "Step 3: Setting up Chrome debug alias..."
SHELL_RC="$HOME/.zshrc"
if [ -n "$BASH_VERSION" ]; then
    SHELL_RC="$HOME/.bashrc"
fi

ALIAS_LINE='alias chrome-debug="/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222 --user-data-dir=\"\$HOME/chrome-debug-profile\" &"'

if grep -q "chrome-debug" "$SHELL_RC"; then
    echo "   ✅ Alias already exists"
else
    echo "$ALIAS_LINE" >> "$SHELL_RC"
    echo "   ✅ Alias added to $SHELL_RC"
    echo "   ⚠️  Run: source $SHELL_RC"
fi

# Step 4: Create directories
echo ""
echo "Step 4: Creating work directories..."
mkdir -p output
mkdir -p images
echo "   ✅ Directories created"

echo ""
echo "================================"
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Restart terminal (or run: source $SHELL_RC)"
echo "   2. Run: chrome-debug"
echo "   3. Login to WeChat Official Accounts Platform"
echo "   4. Test: ./scripts/doctor.sh"
