#!/bin/bash

# NPM Package Publishing Script
# This script automates the publishing process for the backend-server-template package

set -e

echo "🚀 Publishing Backend Server Template Package"
echo "============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: Git working directory is not clean. Please commit or stash your changes."
    exit 1
fi

# Check if we're on main/master branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo "❌ Error: You must be on the main/master branch to publish."
    echo "Current branch: $CURRENT_BRANCH"
    exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📦 Current version: $CURRENT_VERSION"

# Ask for version bump type
echo ""
echo "Select version bump type:"
echo "1) patch (0.0.x) - Bug fixes and minor changes"
echo "2) minor (0.x.0) - New features, backward compatible"
echo "3) major (x.0.0) - Breaking changes"
echo "4) custom - Enter custom version"
echo "5) cancel"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        VERSION_TYPE="patch"
        ;;
    2)
        VERSION_TYPE="minor"
        ;;
    3)
        VERSION_TYPE="major"
        ;;
    4)
        read -p "Enter custom version (e.g., 1.2.3): " CUSTOM_VERSION
        if [[ ! $CUSTOM_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            echo "❌ Error: Invalid version format. Use semantic versioning (e.g., 1.2.3)"
            exit 1
        fi
        NEW_VERSION=$CUSTOM_VERSION
        ;;
    5)
        echo "❌ Publishing cancelled."
        exit 0
        ;;
    *)
        echo "❌ Error: Invalid choice."
        exit 1
        ;;
esac

# Bump version if not custom
if [ -z "$NEW_VERSION" ]; then
    echo "📈 Bumping $VERSION_TYPE version..."
    NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version)
    NEW_VERSION=${NEW_VERSION#v}  # Remove 'v' prefix
else
    echo "📝 Setting custom version: $NEW_VERSION"
    npm version $NEW_VERSION --no-git-tag-version
fi

echo "🆕 New version: $NEW_VERSION"

# Build the project
echo "🔨 Building project..."
npm run build

# Test the build
if [ -d "dist" ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

# Run tests if available
if npm run test 2>/dev/null; then
    echo "✅ Tests passed"
else
    echo "⚠️  No tests found or tests failed"
    read -p "Continue with publishing? (y/N): " continue_choice
    if [[ ! $continue_choice =~ ^[Yy]$ ]]; then
        echo "❌ Publishing cancelled."
        exit 1
    fi
fi

# Check if user is logged in to npm
if ! npm whoami 2>/dev/null; then
    echo "❌ Error: You are not logged in to npm. Please run 'npm login' first."
    exit 1
fi

# Confirm publishing
echo ""
echo "🚀 Ready to publish version $NEW_VERSION to npm"
echo "Package: backend-server-template"
echo "Version: $NEW_VERSION"
echo ""

read -p "Proceed with publishing? (y/N): " publish_choice
if [[ ! $publish_choice =~ ^[Yy]$ ]]; then
    echo "❌ Publishing cancelled."
    # Revert version change
    npm version $CURRENT_VERSION --no-git-tag-version
    exit 0
fi

# Publish to npm
echo "📤 Publishing to npm..."
npm publish

# Create git tag
echo "🏷️  Creating git tag..."
git add package.json package-lock.json
git commit -m "chore: bump version to $NEW_VERSION"
git tag -a "v$NEW_VERSION" -m "Release version $NEW_VERSION"

# Push changes and tags
echo "📤 Pushing to git..."
git push origin $CURRENT_BRANCH
git push origin "v$NEW_VERSION"

echo ""
echo "🎉 Successfully published backend-server-template@$NEW_VERSION!"
echo "============================================="
echo "📦 NPM Package: https://www.npmjs.com/package/backend-server-template"
echo "🏷️  Git Tag: v$NEW_VERSION"
echo "📚 Users can now install with: npm install -g backend-server-template"
echo ""
echo "🚀 Next steps:"
echo "1. Update release notes on GitHub"
echo "2. Share the new version with your community"
echo "3. Monitor for any issues"
echo ""
echo "Happy publishing! 🎊" 