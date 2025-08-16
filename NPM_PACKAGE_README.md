# 🚀 Backend Server Template - NPM Package

A production-ready Node.js/Express.js backend server template with TypeScript, MongoDB, and best practices built-in. Available as an npm package for easy installation and usage.

## 📦 Installation

### Global Installation (Recommended)
```bash
npm install -g backend-server-template
```

### Local Installation
```bash
npm install backend-server-template
```

## 🚀 Usage

### Global Usage
After global installation, you can use the command from anywhere:

```bash
# Create a new backend server project
create-backend-server

# Or use the full command
npx create-backend-server
```

### Local Usage
```bash
# If installed locally
npx backend-server-template

# Or run directly
node node_modules/backend-server-template/generate-project.js
```

## ✨ What You Get

The generator will prompt you for:
- **Project Name**: Your project name (validated for npm compatibility)
- **Description**: Brief description of your project
- **Author**: Your name or organization
- **License**: License type (defaults to MIT)
- **Port**: Server port (defaults to 8000)

## 🏗️ Generated Project Structure

```
your-project-name/
├── src/
│   ├── index.ts              # Application entry point
│   ├── server.ts             # HTTP server setup & lifecycle
│   ├── app.ts               # Express app configuration
│   ├── config/              # Configuration files
│   ├── constants/           # Application constants
│   ├── controllers/         # Request handlers
│   ├── middlewares/         # Custom middleware
│   ├── models/              # Database models
│   ├── repositories/        # Data access layer
│   ├── routes/              # API route definitions
│   ├── services/            # External service integration
│   └── utils/               # Utility functions
├── package.json             # Project configuration
├── tsconfig.json            # TypeScript configuration
├── nodemon.json             # Development configuration
├── .env.development         # Development environment
├── .env.production          # Production environment
└── README.md                # Project documentation
```

## 🔧 Features Included

- **🛡️ Security**: Helmet, CORS, rate limiting ready
- **📊 Database**: MongoDB with Mongoose setup
- **🔧 TypeScript**: Full TypeScript support
- **🏗️ Architecture**: Clean separation of concerns
- **📝 Validation**: Zod schema validation ready
- **🌍 Environment**: Multi-environment configuration
- **📊 Logging**: Structured logging with Morgan
- **🚀 Production**: Graceful shutdown, error handling
- **⚡ Development**: Hot reload, TypeScript compilation

## 🚀 Quick Start

```bash
# Install globally
npm install -g backend-server-template

# Create a new project
create-backend-server

# Follow the prompts
# Enter project name: my-awesome-api
# Enter description: A RESTful API for my app
# Enter author: Your Name
# Enter license: MIT
# Enter port: 8000

# Navigate to your project
cd my-awesome-api

# Start development
npm run dev
```

## 🔧 Customization

After generation, customize your project:

1. **Environment Variables**: Update `.env.development` and `.env.production`
2. **Database**: Configure MongoDB connection in `src/config/db.config.ts`
3. **Routes**: Add your API endpoints in `src/routes/`
4. **Controllers**: Implement business logic in `src/controllers/`
5. **Models**: Define data models in `src/models/`

## 📚 Example Usage

```bash
# Create a user management API
create-backend-server
# Name: user-management-api
# Description: API for managing users and authentication
# Author: John Doe
# License: MIT
# Port: 3000

cd user-management-api
npm run dev
```

## 🎯 Use Cases

- **REST APIs**: Quick backend setup for web applications
- **Microservices**: Template for individual microservices
- **MVP Development**: Fast prototyping with production-ready structure
- **Learning**: Study clean architecture patterns
- **Team Standards**: Consistent project structure across teams

## 🔄 Updating the Template

```bash
# Update the global package
npm update -g backend-server-template

# Or reinstall
npm uninstall -g backend-server-template
npm install -g backend-server-template
```

## 🚨 Troubleshooting

### Permission Issues
```bash
# On Unix-like systems, you might need sudo
sudo npm install -g backend-server-template

# Or use nvm to avoid permission issues
nvm install node
nvm use node
npm install -g backend-server-template
```

### Command Not Found
```bash
# Check if npm global bin is in your PATH
npm config get prefix

# Add to your shell profile (.bashrc, .zshrc, etc.)
export PATH="$(npm config get prefix)/bin:$PATH"
```

### Template Files Missing
```bash
# Reinstall the package
npm uninstall -g backend-server-template
npm install -g backend-server-template
```

## 🤝 Contributing

This template is open for contributions! Feel free to:
- Report issues
- Suggest improvements
- Submit pull requests
- Share your customizations

## 📄 License

MIT License - feel free to use this template for any project.

## 🔗 Links

- **GitHub**: [Repository](https://github.com/yourusername/backend-server-template)
- **NPM**: [Package Page](https://www.npmjs.com/package/backend-server-template)
- **Issues**: [Bug Reports](https://github.com/yourusername/backend-server-template/issues)

---

**Happy Coding! 🎉**

Start building your next backend server in minutes with this template! 