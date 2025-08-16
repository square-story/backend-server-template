#!/bin/bash

# Backend Server Template Setup Script
# This script helps you convert this template into a new project

set -e

echo "🚀 Backend Server Template Setup"
echo "================================"

# Check if project name is provided
if [ -z "$1" ]; then
    echo "❌ Usage: ./setup-template.sh <project-name>"
    echo "Example: ./setup-template.sh my-awesome-api"
    exit 1
fi

PROJECT_NAME=$1
PROJECT_DIR="../$PROJECT_NAME"

echo "📁 Creating new project: $PROJECT_NAME"
echo "📍 Location: $PROJECT_DIR"

# Check if directory already exists
if [ -d "$PROJECT_DIR" ]; then
    echo "❌ Directory $PROJECT_DIR already exists!"
    echo "Please choose a different project name or remove the existing directory."
    exit 1
fi

# Copy template to new directory
echo "📋 Copying template files..."
cp -r . "$PROJECT_DIR"

# Navigate to new project directory
cd "$PROJECT_DIR"

# Remove template-specific files
echo "🧹 Cleaning up template files..."
rm -rf .git
rm template-setup.md
rm env.template
rm setup-template.sh
rm -rf node_modules
rm package-lock.json

# Initialize new git repository
echo "🔧 Initializing new git repository..."
git init

# Update package.json
echo "📝 Updating package.json..."
npm pkg set name="$PROJECT_NAME"
npm pkg set version="1.0.0"
npm pkg set description="Your project description"
npm pkg set author="Your Name"
npm pkg set license="MIT"

# Create environment files
echo "🔐 Creating environment files..."
cp env.template .env.development
cp env.template .env.production
rm env.template

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create initial commit
echo "💾 Creating initial commit..."
git add .
git commit -m "Initial commit: Setup from backend server template"

echo ""
echo "✅ Project setup complete!"
echo "================================"
echo "📁 Project location: $PROJECT_DIR"
echo "🚀 To start development:"
echo "   cd $PROJECT_DIR"
echo "   npm run dev"
echo ""
echo "🔧 Next steps:"
echo "   1. Update .env.development with your configuration"
echo "   2. Modify package.json with your project details"
echo "   3. Update README.md with your project information"
echo "   4. Add your first route and controller"
echo "   5. Start coding! 🎉"
echo ""
echo "📚 See template-setup.md for detailed customization guide" 