#!/bin/bash

# Workflow validation script for celestia-bot permissions
# This script helps validate that the workflows are properly configured

echo "🔍 Validating Celestia Documentation Workflows..."
echo

# Check if workflow files exist
echo "📁 Checking workflow files..."
if [ -f ".github/workflows/latest_tags.yml" ]; then
    echo "  ✅ latest_tags.yml found"
else
    echo "  ❌ latest_tags.yml missing"
fi

if [ -f ".github/workflows/preview.yml" ]; then
    echo "  ✅ preview.yml found"
else
    echo "  ❌ preview.yml missing"
fi

echo

# Check for required directories
echo "📂 Checking required directories..."
if [ -d ".vitepress/constants" ]; then
    echo "  ✅ .vitepress/constants directory exists"
    echo "  📄 Version files:"
    ls -la .vitepress/constants/*.js 2>/dev/null | while read line; do
        echo "    $line"
    done
else
    echo "  ❌ .vitepress/constants directory missing"
fi

echo

# Check workflow syntax (basic YAML validation)
echo "🔧 Checking workflow syntax..."
if command -v yamllint >/dev/null 2>&1; then
    yamllint .github/workflows/latest_tags.yml .github/workflows/preview.yml
else
    echo "  ⚠️  yamllint not installed - skipping YAML validation"
    echo "     Install with: pip install yamllint"
fi

echo

# Check if build works
echo "🏗️  Testing build process..."
if [ -f "package.json" ]; then
    if command -v yarn >/dev/null 2>&1; then
        echo "  📦 Installing dependencies with yarn..."
        yarn install --silent --frozen-lockfile
        
        echo "  🔨 Testing build..."
        if yarn build >/dev/null 2>&1; then
            echo "  ✅ Build successful"
        else
            echo "  ❌ Build failed"
        fi
    else
        echo "  ⚠️  yarn not available - skipping build test"
    fi
else
    echo "  ❌ package.json not found"
fi

echo

# Summary
echo "📋 Summary:"
echo "  • Ensure PAT_CREATE_PR secret is set with repo permissions"
echo "  • Ensure PREVIEW_DEPLOY secret is set with repo permissions"  
echo "  • Both tokens should be created by celestia-bot service account"
echo "  • See .github/workflows/README.md for detailed requirements"

echo
echo "✨ Validation complete!"