#!/bin/bash

# NPM Package Publishing Script
# This script automates the publishing process for the backend-server-template package

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}🎉 $1${NC}"
}

print_header() {
    echo -e "${PURPLE}$1${NC}"
}

print_step() {
    echo -e "${CYAN}🔧 $1${NC}"
}

echo -e "${PURPLE}🚀 Publishing Backend Server Template Package${NC}"
echo -e "${PURPLE}=============================================${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if git is clean
print_step "Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    print_error "Git working directory is not clean. Please commit or stash your changes."
    echo "Uncommitted changes:"
    git status --short
    exit 1
fi
print_status "Git working directory is clean"

# Check if we're on main/master branch
print_step "Checking git branch..."
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    print_error "You must be on the main/master branch to publish."
    echo "Current branch: $CURRENT_BRANCH"
    exit 1
fi
print_status "On correct branch: $CURRENT_BRANCH"

# Check if remote is up to date
print_step "Checking remote status..."
git fetch origin
if [ "$(git rev-list HEAD...origin/$CURRENT_BRANCH --count)" != "0" ]; then
    print_warning "Local branch is not up to date with remote."
    echo "Local commits ahead: $(git rev-list HEAD...origin/$CURRENT_BRANCH --count)"
    echo "Remote commits ahead: $(git rev-list origin/$CURRENT_BRANCH...HEAD --count)"
    read -p "Continue anyway? (y/N): " continue_choice
    if [[ ! $continue_choice =~ ^[Yy]$ ]]; then
        print_error "Publishing cancelled."
        exit 0
    fi
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_info "Current version: $CURRENT_VERSION"

# Run comprehensive tests
print_step "Running comprehensive tests..."
if npm run test > /dev/null 2>&1; then
    print_status "All tests passed"
else
    print_error "Tests failed. Please fix the issues before publishing."
    echo "Run 'npm run test' to see detailed test results."
    exit 1
fi

# Check package size
print_step "Checking package size..."
npm pack > /dev/null 2>&1
PACKAGE_FILE=$(ls *.tgz | head -1)
PACKAGE_SIZE=$(du -h "$PACKAGE_FILE" | cut -f1)
print_info "Package size: $PACKAGE_SIZE"
rm -f "$PACKAGE_FILE"

# Ask for version bump type
echo ""
print_header "Select version bump type:"
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
            print_error "Invalid version format. Use semantic versioning (e.g., 1.2.3)"
            exit 1
        fi
        NEW_VERSION=$CUSTOM_VERSION
        ;;
    5)
        print_error "Publishing cancelled."
        exit 0
        ;;
    *)
        print_error "Invalid choice."
        exit 1
        ;;
esac

# Bump version if not custom
if [ -z "$NEW_VERSION" ]; then
    print_step "Bumping $VERSION_TYPE version..."
    NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version)
    NEW_VERSION=${NEW_VERSION#v}  # Remove 'v' prefix
else
    print_step "Setting custom version: $NEW_VERSION"
    npm version $NEW_VERSION --no-git-tag-version
fi

print_success "New version: $NEW_VERSION"

# Build the project
print_step "Building project..."
npm run build

# Test the build
if [ -d "dist" ]; then
    print_status "Build successful"
else
    print_error "Build failed - dist directory not found"
    exit 1
fi

# Run final tests on built version
print_step "Running tests on built version..."
if npm run test > /dev/null 2>&1; then
    print_status "Tests passed on built version"
else
    print_error "Tests failed on built version"
    exit 1
fi

# Check if user is logged in to npm
print_step "Checking npm authentication..."
if ! npm whoami > /dev/null 2>&1; then
    print_error "You are not logged in to npm. Please run 'npm login' first."
    exit 1
fi
print_status "Authenticated with npm"

# Show package information
print_step "Package information:"
echo "Name: $(node -p "require('./package.json').name")"
echo "Version: $NEW_VERSION"
echo "Description: $(node -p "require('./package.json').description")"
echo "Author: $(node -p "require('./package.json').author")"
echo "License: $(node -p "require('./package.json').license")"
echo "Repository: $(node -p "require('./package.json').repository.url")"

# Check for potential issues
print_step "Checking for potential issues..."

# Check if package name is available
if npm view "$(node -p "require('./package.json').name")" > /dev/null 2>&1; then
    print_warning "Package name already exists on npm"
    echo "This will update the existing package"
else
    print_status "Package name is available"
fi

# Check for sensitive information
if grep -r -i "api_key\|secret\|password\|token\|private_key" src/ > /dev/null 2>&1; then
    print_warning "Potential sensitive information found in source code"
    echo "Please review before publishing"
fi

# Confirm publishing
echo ""
print_header "🚀 Ready to publish version $NEW_VERSION to npm"
echo "Package: $(node -p "require('./package.json').name")"
echo "Version: $NEW_VERSION"
echo ""

read -p "Proceed with publishing? (y/N): " publish_choice
if [[ ! $publish_choice =~ ^[Yy]$ ]]; then
    print_error "Publishing cancelled."
    # Revert version change
    npm version $CURRENT_VERSION --no-git-tag-version
    exit 0
fi

# Publish to npm
print_step "Publishing to npm..."
if npm publish; then
    print_success "Successfully published to npm!"
else
    print_error "Failed to publish to npm"
    # Revert version change
    npm version $CURRENT_VERSION --no-git-tag-version
    exit 1
fi

# Create git tag
print_step "Creating git tag..."
git add package.json package-lock.json
git commit -m "chore: bump version to $NEW_VERSION"
git tag -a "v$NEW_VERSION" -m "Release version $NEW_VERSION"

# Push changes and tags
print_step "Pushing to git..."
git push origin $CURRENT_BRANCH
git push origin "v$NEW_VERSION"

# Show success message
echo ""
print_success "Successfully published $(node -p "require('./package.json').name")@$NEW_VERSION!"
echo -e "${PURPLE}=============================================${NC}"
echo "📦 NPM Package: https://www.npmjs.com/package/$(node -p "require('./package.json').name")"
echo "🏷️  Git Tag: v$NEW_VERSION"
echo "📚 Users can now install with: npm install -g $(node -p "require('./package.json').name")"
echo ""
print_header "🚀 Next steps:"
echo "1. Update release notes on GitHub"
echo "2. Share the new version with your community"
echo "3. Monitor for any issues"
echo "4. Update documentation if needed"
echo ""
print_success "Happy publishing! 🎊"

# Optional: Open npm package page
read -p "Open npm package page in browser? (y/N): " open_browser
if [[ $open_browser =~ ^[Yy]$ ]]; then
    npm_package_name=$(node -p "require('./package.json').name")
    if command -v open > /dev/null 2>&1; then
        open "https://www.npmjs.com/package/$npm_package_name"
    elif command -v xdg-open > /dev/null 2>&1; then
        xdg-open "https://www.npmjs.com/package/$npm_package_name"
    else
        echo "Please visit: https://www.npmjs.com/package/$npm_package_name"
    fi
fi 