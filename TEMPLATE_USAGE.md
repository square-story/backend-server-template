# 🚀 Template Usage Guide

This document explains the different ways you can use this backend server template.

## 📋 Available Methods

### 1. 🐚 Bash Script (Fastest)
```bash
# Make executable and run
chmod +x setup-template.sh
./setup-template.sh my-project-name
```

**Pros**: Fast, automated, no dependencies
**Cons**: Less interactive, limited customization

### 2. 🟢 Node.js Generator (Most Flexible)
```bash
# Run the interactive generator
node generate-project.js
```

**Pros**: Interactive prompts, customizable, handles edge cases
**Cons**: Requires Node.js, slightly slower

### 3. 📁 Manual Copy (Most Control)
```bash
# Copy manually and customize
cp -r . ../my-project-name
cd ../my-project-name
# Remove template files and customize
```

**Pros**: Full control, no automation surprises
**Cons**: Time-consuming, error-prone

## 🎯 Recommended Workflow

### For Quick Projects
Use the bash script:
```bash
./setup-template.sh my-api
cd ../my-api
npm run dev
```

### For Important Projects
Use the Node.js generator:
```bash
node generate-project.js
# Follow the prompts
cd ../my-project-name
npm run dev
```

## 🔧 What Happens During Setup

1. **File Copying**: Template files copied to new directory
2. **Cleanup**: Template-specific files removed
3. **Git Init**: New repository initialized
4. **Package Update**: package.json customized
5. **Environment Setup**: .env files created
6. **Dependencies**: npm install run
7. **Initial Commit**: First commit created

## 📁 Files Created/Modified

### New Files
- `.env.development` - Development environment
- `.env.production` - Production environment
- `../your-project-name/` - New project directory

### Modified Files
- `package.json` - Name, description, author updated
- Git repository - New history started

### Removed Files
- Template documentation
- Setup scripts
- Template-specific files

## 🚨 Common Issues

### Permission Denied
```bash
chmod +x setup-template.sh
```

### Directory Already Exists
```bash
rm -rf ../project-name
./setup-template.sh project-name
```

### Dependencies Fail
```bash
cd ../project-name
rm -rf node_modules package-lock.json
npm install
```

## 🎉 After Setup

1. **Start Development**
   ```bash
   npm run dev
   ```

2. **Customize Environment**
   ```bash
   nano .env.development
   ```

3. **Add Your First Route**
   ```bash
   # Create src/routes/users.ts
   # Create src/controllers/user.controller.ts
   # Update src/routes/index.ts
   ```

4. **Test Your Setup**
   ```bash
   curl http://localhost:8000/health
   ```

## 🔄 Updating the Template

To keep your template current:

1. **Pull Updates**
   ```bash
   git pull origin main
   ```

2. **Update Dependencies**
   ```bash
   npm update
   npm audit fix
   ```

3. **Test the Template**
   ```bash
   ./setup-template.sh test-project
   cd ../test-project
   npm run dev
   ```

## 📚 Next Steps

- [ ] Read the main README.md
- [ ] Set up your database connection
- [ ] Create your first API endpoint
- [ ] Add authentication if needed
- [ ] Set up testing framework
- [ ] Configure CI/CD pipeline

---

**Happy templating! 🎯** 