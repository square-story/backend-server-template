# Backend Server Template Setup Guide

## 🚀 Quick Start for New Projects

### Method 1: Clone as Template (Recommended)
```bash
# Clone this template repository
git clone <your-template-repo-url> your-new-project-name
cd your-new-project-name

# Remove template-specific files
rm -rf .git
rm template-setup.md
rm -rf node_modules
rm package-lock.json

# Initialize as new project
git init
npm install

# Update package.json with your project details
npm pkg set name="your-project-name"
npm pkg set version="1.0.0"
npm pkg set description="Your project description"
npm pkg set author="Your Name"
npm pkg set license="MIT"

# Start development
npm run dev
```

### Method 2: Copy and Customize
```bash
# Copy the template to a new directory
cp -r /path/to/backend-server-template /path/to/your-new-project
cd /path/to/your-new-project

# Follow the same steps as Method 1
```

## 🔧 Customization Steps

### 1. Update Project Information
- Edit `package.json` name, version, description, author
- Update `README.md` with your project details
- Modify environment variables in `.env.example`

### 2. Configure Database
- Update MongoDB connection in `src/config/db.config.ts`
- Modify database models in `src/models/`
- Update environment variables for database connection

### 3. Add Your Business Logic
- Create routes in `src/routes/`
- Implement controllers in `src/controllers/`
- Add services in `src/services/`
- Define models in `src/models/`

### 4. Environment Setup
```bash
# Copy environment template
cp .env.example .env.development
cp .env.example .env.production

# Edit with your values
nano .env.development
```

## 📁 Template Structure

This template provides:
- ✅ Express.js server with TypeScript
- ✅ MongoDB with Mongoose
- ✅ JWT authentication ready
- ✅ Security middleware (Helmet, CORS)
- ✅ Error handling and logging
- ✅ Environment configuration
- ✅ Clean architecture pattern
- ✅ Development and production scripts

## 🎯 What to Customize

### Required Changes:
- Project name and metadata
- Database connection details
- Environment variables
- Business logic and routes
- Authentication strategy (if different)

### Optional Changes:
- Add additional middleware
- Implement specific validation schemas
- Add testing framework
- Include API documentation
- Add Docker configuration

## 🚨 Important Notes

1. **Never commit sensitive data** - Use environment variables
2. **Update dependencies** - Check for newer versions
3. **Customize security settings** - Adjust CORS, rate limiting
4. **Add your own error handling** - Extend the base error middleware
5. **Implement proper logging** - Add production logging strategy

## 📚 Next Steps

After setting up your template:
1. Add your first route and controller
2. Set up your database models
3. Implement authentication (if needed)
4. Add validation schemas
5. Write tests
6. Deploy to your hosting platform

## 🔗 Useful Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check TypeScript compilation
npx tsc --noEmit
``` 