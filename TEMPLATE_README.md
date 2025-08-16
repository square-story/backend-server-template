# 🚀 Backend Server Template

A production-ready Node.js/Express.js backend server template with TypeScript, MongoDB, and best practices built-in.

## ✨ Features

- **🛡️ Security First**: Helmet, CORS, rate limiting, JWT authentication ready
- **📊 Database Ready**: MongoDB with Mongoose ODM
- **🔧 TypeScript**: Full TypeScript support with proper configuration
- **🏗️ Clean Architecture**: Separation of concerns with controllers, services, repositories
- **📝 Validation**: Zod schema validation ready
- **🌍 Environment Config**: Multi-environment configuration support
- **📊 Logging**: Structured logging with Morgan
- **🚀 Production Ready**: Graceful shutdown, error handling, health checks
- **⚡ Development**: Hot reload with Nodemon, TypeScript compilation

## 🚀 Quick Start

### Option 1: Use the Setup Script (Recommended)
```bash
# Make sure you're in the template directory
chmod +x setup-template.sh

# Create a new project
./setup-template.sh my-awesome-api

# Navigate to your new project
cd ../my-awesome-api

# Start development
npm run dev
```

### Option 2: Manual Setup
```bash
# Clone or copy this template
git clone <this-repo> your-project-name
cd your-project-name

# Remove template files
rm -rf .git
rm TEMPLATE_README.md
rm template-setup.md
rm setup-template.sh
rm env.template

# Initialize new project
git init
npm install

# Update package.json
npm pkg set name="your-project-name"
npm pkg set version="1.0.0"
npm pkg set description="Your project description"

# Copy environment template
cp env.template .env.development
cp env.template .env.production
```

## 📁 Project Structure

```
src/
├── index.ts              # Application entry point
├── server.ts             # HTTP server setup & lifecycle
├── app.ts               # Express app configuration
├── config/              # Configuration files
│   ├── db.config.ts     # Database configuration
│   ├── env.config.ts    # Environment variables
│   ├── initial.config.ts # Initial app configuration
│   └── logger.config.ts # Logging configuration
├── constants/           # Application constants
│   ├── index.ts        # Constants export
│   ├── response-message.constant.ts # Response messages
│   └── status.constant.ts # HTTP status codes
├── controllers/         # Request handlers (business logic)
├── middlewares/         # Custom middleware
│   ├── error.middleware.ts # Global error handler
│   └── not-found.middleware.ts # 404 handler
├── models/              # Database models (Mongoose schemas)
├── repositories/        # Data access layer
├── routes/              # API route definitions
│   └── index.ts        # Route aggregation
├── services/            # External service integration
└── utils/               # Utility functions
    ├── http-error.util.ts # HTTP error utility
    └── index.ts         # Utilities export
```

## 🔧 Configuration

### Environment Variables

Copy `env.template` to `.env.development` and `.env.production`:

```bash
# Server
PORT=8000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/your-db
MONGO_DB_NAME=your-db-name

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

### Database Connection

The template includes MongoDB configuration in `src/config/db.config.ts`. Update the connection string and options as needed.

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npx tsc --noEmit
```

## 📚 Adding Your Features

### 1. Create a Route
```typescript
// src/routes/users.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController();

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

export default router;
```

### 2. Create a Controller
```typescript
// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  private userService = new UserService();

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };
}
```

### 3. Create a Model
```typescript
// src/models/user.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>('User', userSchema);
```

### 4. Register Routes
```typescript
// src/routes/index.ts
import { Router } from 'express';
import userRoutes from './users';

const router = Router();

router.use('/users', userRoutes);

export default router;
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: Built-in protection against abuse
- **Input Validation**: Zod schema validation ready
- **JWT Authentication**: Token-based auth system ready

## 🧪 Testing

The template is structured for easy testing:

```typescript
// Example test structure
import request from 'supertest';
import app from '../app';

describe('User API', () => {
  it('should get all users', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
  });
});
```

## 🚀 Deployment

### Build and Deploy
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables
Make sure to set all required environment variables in your production environment.

## 📝 Customization

### What to Change:
- Project name and metadata
- Database connection details
- Environment variables
- Business logic and routes
- Authentication strategy

### What to Keep:
- Project structure
- Security middleware
- Error handling
- Logging configuration
- Development scripts

## 🤝 Contributing

This template is designed to be a starting point. Feel free to:
- Add new features
- Improve security
- Enhance error handling
- Add more middleware
- Include additional tools

## 📄 License

This template is provided as-is. Customize it for your projects and use it freely.

## 🆘 Support

If you encounter issues:
1. Check the configuration files
2. Verify environment variables
3. Ensure MongoDB is running
4. Check the console for error messages

---

**Happy Coding! 🎉** 