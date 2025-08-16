#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query, defaultValue = '') {
    return new Promise(resolve => {
        if (defaultValue) {
            rl.question(`${query} (${defaultValue}): `, (answer) => {
                resolve(answer.trim() || defaultValue);
            });
        } else {
            rl.question(query, (answer) => {
                resolve(answer.trim());
            });
        }
    });
}

function validatePackageName(name) {
    // npm package name validation rules
    const validNameRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
    if (!validNameRegex.test(name)) {
        return 'Package name must be lowercase, can contain hyphens, and cannot start/end with hyphen';
    }
    if (name.length > 214) {
        return 'Package name cannot be longer than 214 characters';
    }
    if (name.startsWith('.') || name.startsWith('_')) {
        return 'Package name cannot start with . or _';
    }
    return null;
}

function validateDirectoryName(name) {
    // Directory name validation
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(name)) {
        return 'Directory name contains invalid characters';
    }
    return null;
}

function validatePort(port) {
    const portNum = parseInt(port);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        return 'Port must be a number between 1 and 65535';
    }
    return null;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return null;
}

function showProgress(message, current, total) {
    const percentage = Math.round((current / total) * 100);
    const barLength = 30;
    const filledLength = Math.round((barLength * current) / total);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
    process.stdout.write(`\r${message} [${bar}] ${percentage}% (${current}/${total})`);
}

function showSpinner(message, interval = 100) {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    const spinner = setInterval(() => {
        process.stdout.write(`\r${frames[i]} ${message}`);
        i = (i + 1) % frames.length;
    }, interval);
    return () => clearInterval(spinner);
}

async function generateProject() {
    console.log('🚀 Backend Server Template Project Generator');
    console.log('==========================================\n');
    console.log('This tool will create a production-ready Node.js/Express.js backend server');
    console.log('with TypeScript, MongoDB, and best practices built-in.\n');

    try {
        // Get project details with better validation and defaults
        console.log('📝 Project Configuration');
        console.log('------------------------');

        const projectName = await question('Enter project name');
        if (!projectName) {
            console.log('❌ Project name is required!');
            process.exit(1);
        }

        // Validate package name
        const packageNameError = validatePackageName(projectName);
        if (packageNameError) {
            console.log(`❌ Invalid package name: ${packageNameError}`);
            console.log('💡 Try using only lowercase letters, numbers, and hyphens');
            console.log('💡 Examples: my-api, backend-service, user-management');
            process.exit(1);
        }

        // Validate directory name
        const dirNameError = validateDirectoryName(projectName);
        if (dirNameError) {
            console.log(`❌ Invalid directory name: ${dirNameError}`);
            process.exit(1);
        }

        const projectDescription = await question('Enter project description', 'A production-ready Node.js backend server');
        const authorName = await question('Enter author name', 'Your Name');
        const authorEmail = await question('Enter author email (optional)');

        // Validate email if provided
        const emailError = validateEmail(authorEmail);
        if (emailError) {
            console.log(`❌ ${emailError}`);
            process.exit(1);
        }

        const license = await question('Enter license', 'MIT');
        const port = await question('Enter port number', '8000');

        // Validate port
        const portError = validatePort(port);
        if (portError) {
            console.log(`❌ ${portError}`);
            process.exit(1);
        }

        // Additional configuration options
        console.log('\n🔧 Additional Configuration');
        console.log('---------------------------');

        const useDocker = (await question('Add Docker support? (y/N)')).toLowerCase() === 'y';
        const useGitHooks = (await question('Add Git hooks (husky)? (y/N)')).toLowerCase() === 'y';
        const useESLint = (await question('Add ESLint configuration? (y/N)')).toLowerCase() === 'y';
        const usePrettier = (await question('Add Prettier configuration? (y/N)')).toLowerCase() === 'y';
        const useJest = (await question('Add Jest testing framework? (y/N)')).toLowerCase() === 'y';

        // Determine project directory
        const currentDir = process.cwd();
        const projectDir = path.resolve(currentDir, projectName);

        // Check if directory exists
        if (fs.existsSync(projectDir)) {
            console.log(`\n❌ Directory ${projectName} already exists in the current location!`);
            console.log('💡 Please choose a different name or remove the existing directory');
            process.exit(1);
        }

        // Show project summary
        console.log('\n📋 Project Summary');
        console.log('------------------');
        console.log(`Project Name: ${projectName}`);
        console.log(`Description: ${projectDescription}`);
        console.log(`Author: ${authorName}${authorEmail ? ` (${authorEmail})` : ''}`);
        console.log(`License: ${license}`);
        console.log(`Port: ${port}`);
        console.log(`Docker: ${useDocker ? 'Yes' : 'No'}`);
        console.log(`Git Hooks: ${useGitHooks ? 'Yes' : 'No'}`);
        console.log(`ESLint: ${useESLint ? 'Yes' : 'No'}`);
        console.log(`Prettier: ${usePrettier ? 'Yes' : 'No'}`);
        console.log(`Jest: ${useJest ? 'Yes' : 'No'}`);
        console.log(`Location: ${projectDir}`);

        const confirm = await question('\nProceed with project creation? (Y/n)').toLowerCase();
        if (confirm === 'n' || confirm === 'no') {
            console.log('❌ Project creation cancelled.');
            process.exit(0);
        }

        console.log(`\n📁 Creating project: ${projectName}`);
        console.log(`📍 Location: ${projectDir}\n`);

        // Copy template files
        console.log('📋 Copying template files...');
        const templateDir = path.resolve(__dirname);

        // Ensure we're not copying to a subdirectory of the template
        if (projectDir.startsWith(templateDir + path.sep)) {
            console.log('❌ Error: Cannot create project inside the template directory');
            console.log('💡 Please run the command from a different directory');
            process.exit(1);
        }

        const stopSpinner = showSpinner('Copying files...');

        await fs.copy(templateDir, projectDir, {
            filter: (src) => {
                // Exclude template-specific files and directories
                const excludePatterns = [
                    '.git',
                    'node_modules',
                    'dist',
                    'coverage',
                    '.nyc_output',
                    '*.log',
                    'npm-debug.log*',
                    'yarn-debug.log*',
                    'yarn-error.log*',
                    '.DS_Store',
                    'Thumbs.db',
                    '.vscode',
                    '.idea',
                    '*.swp',
                    '*.swo',
                    '*~',
                    '.env',
                    '.env.local',
                    '.env.production',
                    '.env.development',
                    'package-lock.json',
                    'yarn.lock',
                    'pnpm-lock.yaml',
                    '*.tgz',
                    'tmp',
                    'temp',
                    '.tmp'
                ];

                const srcName = path.basename(src);
                const srcDir = path.dirname(src);

                // Always exclude these patterns
                for (const pattern of excludePatterns) {
                    if (srcName === pattern || srcName.startsWith(pattern) || srcName.endsWith(pattern)) {
                        return false;
                    }
                }

                // Exclude template-specific documentation
                if (srcName.includes('TEMPLATE_') || srcName.includes('NPM_PACKAGE_')) {
                    return false;
                }

                // Exclude scripts directory (will be customized)
                if (srcDir.endsWith('scripts')) {
                    return false;
                }

                return true;
            }
        });

        stopSpinner();
        console.log('\r✅ Files copied successfully');

        // Customize package.json
        console.log('\n📦 Customizing package.json...');
        const packageJsonPath = path.join(projectDir, 'package.json');
        const packageJson = require(packageJsonPath);

        packageJson.name = projectName;
        packageJson.description = projectDescription;
        packageJson.author = authorEmail ? `${authorName} <${authorEmail}>` : authorName;
        packageJson.license = license;
        packageJson.version = '1.0.0';
        packageJson.repository = {
            type: 'git',
            url: `https://github.com/yourusername/${projectName}.git`
        };
        packageJson.bugs = {
            url: `https://github.com/yourusername/${projectName}/issues`
        };
        packageJson.homepage = `https://github.com/yourusername/${projectName}#readme`;

        // Remove template-specific configurations
        delete packageJson.bin;
        delete packageJson.preferGlobal;
        delete packageJson.publishConfig;
        delete packageJson.prepublishOnly;
        delete packageJson.postinstall;

        // Update scripts
        packageJson.scripts = {
            "dev": "NODE_ENV=development nodemon",
            "start": "NODE_ENV=production node dist",
            "build": "tsc && tsc-alias",
            "test": useJest ? "jest" : "echo \"No tests specified\"",
            "test:watch": useJest ? "jest --watch" : "echo \"No tests specified\"",
            "test:coverage": useJest ? "jest --coverage" : "echo \"No tests specified\"",
            "lint": useESLint ? "eslint src/**/*.ts" : "echo \"No linting configured\"",
            "lint:fix": useESLint ? "eslint src/**/*.ts --fix" : "echo \"No linting configured\"",
            "format": usePrettier ? "prettier --write src/**/*.ts" : "echo \"No formatting configured\"",
            "prepare": useGitHooks ? "husky install" : "echo \"No git hooks configured\""
        };

        // Add conditional dependencies
        if (useJest) {
            packageJson.devDependencies = packageJson.devDependencies || {};
            packageJson.devDependencies.jest = "^29.7.0";
            packageJson.devDependencies["@types/jest"] = "^29.5.8";
        }

        if (useESLint) {
            packageJson.devDependencies = packageJson.devDependencies || {};
            packageJson.devDependencies.eslint = "^8.57.0";
            packageJson.devDependencies["@typescript-eslint/eslint-plugin"] = "^6.21.0";
            packageJson.devDependencies["@typescript-eslint/parser"] = "^6.21.0";
        }

        if (usePrettier) {
            packageJson.devDependencies = packageJson.devDependencies || {};
            packageJson.devDependencies.prettier = "^3.2.5";
        }

        if (useGitHooks) {
            packageJson.devDependencies = packageJson.devDependencies || {};
            packageJson.devDependencies.husky = "^8.0.3";
            packageJson.devDependencies["lint-staged"] = "^15.2.2";
        }

        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

        // Customize environment configuration
        console.log('🔧 Customizing environment configuration...');
        const envTemplatePath = path.join(projectDir, 'env.template');
        let envContent = await fs.readFile(envTemplatePath, 'utf8');
        envContent = envContent.replace(/PORT=\d+/, `PORT=${port}`);
        await fs.writeFile(envTemplatePath, envContent);

        // Create .env file
        const envPath = path.join(projectDir, '.env');
        await fs.copy(envTemplatePath, envPath);

        // Create .gitignore
        console.log('📝 Creating .gitignore...');
        const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Environment files
.env
.env.local
.env.production
.env.development
.env.test
.env.staging

# Keep only the example
!.env.example

# Build output
dist/
build/
*.tsbuildinfo

# Logs
*.log
logs/
*.log.*

# Coverage directory used by tools like istanbul
coverage/
*.lcov
.nyc_output/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Temporary folders
tmp/
temp/
.tmp/

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Package manager files
package-lock.json
yarn.lock
pnpm-lock.yaml

# Test files
test-results/
playwright-report/
playwright/.cache/

# Local development
.local/
.localhost/

# Database
*.db
*.sqlite
*.sqlite3

# SSL certificates
*.pem
*.key
*.crt
*.csr

# Backup files
*.bak
*.backup
*.old

# Archive files
*.zip
*.tar.gz
*.rar
`;
        await fs.writeFile(path.join(projectDir, '.gitignore'), gitignoreContent);

        // Create README.md
        console.log('📚 Creating README.md...');
        const readmeContent = `# ${projectName}

${projectDescription}

## 🚀 Features

- **TypeScript**: Full TypeScript support with strict type checking
- **Express.js**: Fast, unopinionated web framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT Authentication**: Secure authentication system
- **Input Validation**: Zod schema validation
- **Error Handling**: Comprehensive error handling middleware
- **Logging**: Morgan HTTP request logger
- **Security**: Helmet.js security headers
- **CORS**: Cross-origin resource sharing support
- **Environment Configuration**: Flexible environment setup

## 📋 Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB (local or cloud instance)

## 🛠️ Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/${projectName}.git
cd ${projectName}
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp env.template .env
# Edit .env with your configuration
\`\`\`

4. Build the project:
\`\`\`bash
npm run build
\`\`\`

5. Start the server:
\`\`\`bash
# Development
npm run dev

# Production
npm start
\`\`\`

## 🔧 Configuration

The server runs on port ${port} by default. You can change this in the \`.env\` file.

## 📁 Project Structure

\`\`\`
src/
├── config/          # Configuration files
├── constants/       # Application constants
├── controllers/     # Route controllers
├── middlewares/     # Custom middlewares
├── models/          # Database models
├── repositories/    # Data access layer
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── app.ts           # Express app setup
├── server.ts        # Server configuration
└── index.ts         # Application entry point
\`\`\`

## 🧪 Testing

${useJest ? `Run tests with Jest:
\`\`\`bash
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
\`\`\`` : 'No testing framework configured. Consider adding Jest for testing.'}

## 📝 API Documentation

API documentation will be available at \`http://localhost:${port}/api-docs\` when the server is running.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ${license} License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

${authorName}${authorEmail ? ` - ${authorEmail}` : ''}

## 🙏 Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- TypeScript support
- MongoDB integration with Mongoose
- Security best practices with Helmet.js
`;
        await fs.writeFile(path.join(projectDir, 'README.md'), readmeContent);

        // Create additional configuration files based on user choices
        if (useESLint) {
            console.log('🔍 Creating ESLint configuration...');
            const eslintConfig = {
                "env": {
                    "es2021": true,
                    "node": true
                },
                "extends": [
                    "eslint:recommended",
                    "@typescript-eslint/recommended"
                ],
                "parser": "@typescript-eslint/parser",
                "parserOptions": {
                    "ecmaVersion": "latest",
                    "sourceType": "module"
                },
                "plugins": [
                    "@typescript-eslint"
                ],
                "rules": {
                    "indent": ["error", 2],
                    "linebreak-style": ["error", "unix"],
                    "quotes": ["error", "single"],
                    "semi": ["error", "always"],
                    "@typescript-eslint/no-unused-vars": "error",
                    "@typescript-eslint/explicit-function-return-type": "warn"
                }
            };
            await fs.writeJson(path.join(projectDir, '.eslintrc.json'), eslintConfig, { spaces: 2 });
        }

        if (usePrettier) {
            console.log('💅 Creating Prettier configuration...');
            const prettierConfig = {
                "semi": true,
                "trailingComma": "es5",
                "singleQuote": true,
                "printWidth": 80,
                "tabWidth": 2,
                "useTabs": false
            };
            await fs.writeJson(path.join(projectDir, '.prettierrc.json'), prettierConfig, { spaces: 2 });
        }

        if (useJest) {
            console.log('🧪 Creating Jest configuration...');
            const jestConfig = {
                "preset": "ts-jest",
                "testEnvironment": "node",
                "roots": ["<rootDir>/src"],
                "testMatch": ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
                "transform": {
                    "^.+\\.ts$": "ts-jest"
                },
                "collectCoverageFrom": [
                    "src/**/*.ts",
                    "!src/**/*.d.ts"
                ]
            };
            await fs.writeJson(path.join(projectDir, 'jest.config.js'), jestConfig, { spaces: 2 });
        }

        if (useDocker) {
            console.log('🐳 Creating Docker configuration...');
            const dockerfile = `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY dist ./dist

EXPOSE ${port}

CMD ["npm", "start"]
`;
            await fs.writeFile(path.join(projectDir, 'Dockerfile'), dockerfile);

            const dockerignore = `node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.nyc_output
dist
`;
            await fs.writeFile(path.join(projectDir, '.dockerignore'), dockerignore);

            const dockerCompose = `version: '3.8'
services:
  app:
    build: .
    ports:
      - "${port}:${port}"
    environment:
      - NODE_ENV=production
      - PORT=${port}
    depends_on:
      - mongodb
    restart: unless-stopped

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
`;
            await fs.writeFile(path.join(projectDir, 'docker-compose.yml'), dockerCompose);
        }

        // Initialize git repository
        console.log('📚 Initializing git repository...');
        try {
            process.chdir(projectDir);
            execSync('git init', { stdio: 'pipe' });
            execSync('git add .', { stdio: 'pipe' });
            execSync('git commit -m "Initial commit: Backend server template"', { stdio: 'pipe' });
            console.log('✅ Git repository initialized');
        } catch (error) {
            console.log('⚠️  Git initialization failed (git may not be installed)');
        }

        // Install dependencies
        console.log('\n📦 Installing dependencies...');
        const installSpinner = showSpinner('Installing packages...');
        try {
            execSync('npm install', { stdio: 'pipe' });
            stopSpinner();
            console.log('\r✅ Dependencies installed successfully');
        } catch (error) {
            stopSpinner();
            console.log('\r❌ Failed to install dependencies');
            console.log('💡 You can run "npm install" manually in the project directory');
        }

        // Success message
        console.log('\n🎉 Project created successfully!');
        console.log('================================');
        console.log(`📁 Project: ${projectName}`);
        console.log(`📍 Location: ${projectDir}`);
        console.log(`🌐 Server will run on: http://localhost:${port}`);

        console.log('\n🚀 Next steps:');
        console.log(`1. cd ${projectName}`);
        console.log('2. npm run dev (for development)');
        console.log('3. npm run build && npm start (for production)');

        if (useDocker) {
            console.log('4. docker-compose up (to run with Docker)');
        }

        console.log('\n📚 Documentation:');
        console.log('- README.md - Project overview and setup');
        console.log('- src/ - Source code structure');
        console.log('- env.template - Environment variables');

        console.log('\n🎯 Happy coding! 🚀');

    } catch (error) {
        console.error('\n❌ Error creating project:', error.message);
        process.exit(1);
    } finally {
        rl.close();
    }
}

// Run the generator
if (require.main === module) {
    generateProject();
}

module.exports = { generateProject };