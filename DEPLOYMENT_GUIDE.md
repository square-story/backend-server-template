# 🚀 NPM Package Deployment Guide

This guide explains how to publish and maintain the `backend-server-template` npm package.

## 📋 Prerequisites

Before publishing, ensure you have:

- [ ] Node.js and npm installed
- [ ] npm account created and logged in
- [ ] Git repository set up with remote origin
- [ ] All template files properly configured

## 🔧 Setup Steps

### 1. Login to npm
```bash
npm login
# Enter your username, password, and email
```

### 2. Verify npm configuration
```bash
npm whoami
# Should display your npm username
```

### 3. Check package configuration
```bash
npm run test
# Should run all package tests successfully
```

## 📦 Publishing Process

### Option 1: Automated Publishing (Recommended)
```bash
# Run the automated publish script
npm run publish:package

# Follow the interactive prompts:
# 1. Select version bump type
# 2. Confirm publishing
# 3. Wait for completion
```

### Option 2: Manual Publishing
```bash
# 1. Bump version
npm version patch  # or minor, major

# 2. Build the project
npm run build

# 3. Publish to npm
npm publish

# 4. Create git tag
git tag -a "v$(npm run version --silent)" -m "Release version $(npm run version --silent)"

# 5. Push changes and tags
git push origin main
git push origin --tags
```

## 🔄 Version Management

### Semantic Versioning
- **Patch (0.0.x)**: Bug fixes, minor improvements
- **Minor (0.x.0)**: New features, backward compatible
- **Major (x.0.0)**: Breaking changes

### Version Commands
```bash
# Bump patch version (0.0.1 -> 0.0.2)
npm version patch

# Bump minor version (0.1.0 -> 0.2.0)
npm version minor

# Bump major version (1.0.0 -> 2.0.0)
npm version major

# Set custom version
npm version 1.2.3
```

## 🧪 Testing Before Publishing

### 1. Run Package Tests
```bash
npm run test
```

### 2. Test Local Installation
```bash
# Install package locally
npm install -g .

# Test the command
create-backend-server

# Uninstall local version
npm uninstall -g backend-server-template
```

### 3. Test Build Process
```bash
npm run build
# Verify dist/ directory is created
```

## 📤 Publishing Checklist

Before publishing, verify:

- [ ] All tests pass (`npm run test`)
- [ ] Build is successful (`npm run build`)
- [ ] Git working directory is clean
- [ ] You're on main/master branch
- [ ] Package.json has correct metadata
- [ ] All template files are included
- [ ] .npmignore excludes unnecessary files

## 🚨 Common Issues & Solutions

### Permission Denied
```bash
# On Unix-like systems
sudo npm publish

# Or use nvm to avoid permission issues
nvm install node
nvm use node
npm publish
```

### Package Already Exists
```bash
# Check if package name is taken
npm search backend-server-template

# If taken, update package.json with new name
# Or use scoped package: @yourusername/backend-server-template
```

### Build Failures
```bash
# Clean and rebuild
rm -rf dist/ node_modules/
npm install
npm run build
```

### Git Issues
```bash
# Ensure you're on main branch
git checkout main

# Clean working directory
git status
git stash  # if needed
```

## 🔍 Post-Publishing Verification

### 1. Check npm Registry
```bash
# Verify package is published
npm view backend-server-template

# Check version
npm view backend-server-template version
```

### 2. Test Global Installation
```bash
# Install globally
npm install -g backend-server-template

# Test command
create-backend-server

# Uninstall
npm uninstall -g backend-server-template
```

### 3. Verify GitHub Release
- Check if git tag was created
- Verify tag was pushed to remote
- Update GitHub release notes if needed

## 📈 Package Analytics

Monitor your package:

```bash
# View download statistics
npm stats backend-server-template

# Check package info
npm info backend-server-template
```

## 🔄 Updating the Package

### 1. Make Changes
- Update template files
- Modify package.json if needed
- Test locally

### 2. Test Changes
```bash
npm run test
npm run build
```

### 3. Publish Update
```bash
npm run publish:package
# Follow prompts for version bump
```

## 🏷️ Release Management

### Creating Release Notes
1. Go to GitHub repository
2. Click "Releases"
3. Click "Create a new release"
4. Select the new tag
5. Add release notes
6. Publish release

### Release Notes Template
```markdown
## 🚀 What's New
- Feature 1 description
- Feature 2 description
- Bug fix description

## 🔧 Technical Changes
- Updated dependencies
- Improved error handling
- Enhanced validation

## 📚 Migration Guide
- Any breaking changes
- Required updates
- Deprecation notices
```

## 🚨 Emergency Procedures

### Unpublishing (Within 72 hours)
```bash
npm unpublish backend-server-template@version
```

### Deprecating Package
```bash
npm deprecate backend-server-template "This package is deprecated. Use @new-package instead."
```

## 📚 Best Practices

1. **Always test before publishing**
2. **Use semantic versioning**
3. **Keep git history clean**
4. **Document breaking changes**
5. **Monitor package usage**
6. **Respond to issues promptly**
7. **Maintain backward compatibility when possible**

## 🔗 Useful Commands

```bash
# Package management
npm pack                    # Create tarball
npm publish --dry-run      # Test publish without actually publishing
npm view backend-server-template --json  # Detailed package info

# Git management
git log --oneline          # View commit history
git tag -l                 # List all tags
git show v1.0.0            # Show tag details

# npm management
npm whoami                 # Check current user
npm config list            # View npm configuration
npm cache clean --force    # Clean npm cache
```

## 🎯 Next Steps After Publishing

1. **Share the package** with your community
2. **Monitor downloads** and feedback
3. **Respond to issues** and feature requests
4. **Plan next release** based on feedback
5. **Update documentation** as needed

---

**Happy Publishing! 🎉**

Your template is now available to developers worldwide through npm! 