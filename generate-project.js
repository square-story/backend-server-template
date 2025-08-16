#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
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

async function generateProject() {
    console.log('🚀 Backend Server Template Project Generator');
    console.log('==========================================\n');

    try {
        // Get project details
        const projectName = await question('Enter project name: ');
        const projectDescription = await question('Enter project description: ');
        const authorName = await question('Enter author name: ');
        const license = await question('Enter license (default: MIT): ') || 'MIT';
        const port = await question('Enter port number (default: 8000): ') || '8000';

        if (!projectName) {
            console.log('❌ Project name is required!');
            process.exit(1);
        }

        // Validate package name
        const packageNameError = validatePackageName(projectName);
        if (packageNameError) {
            console.log(`❌ Invalid package name: ${packageNameError}`);
            console.log('💡 Try using only lowercase letters, numbers, and hyphens');
            process.exit(1);
        }

        // Validate directory name
        const dirNameError = validateDirectoryName(projectName);
        if (dirNameError) {
            console.log(`❌ Invalid directory name: ${dirNameError}`);
            process.exit(1);
        }

        // Determine project directory
        const currentDir = process.cwd();
        const projectDir = path.resolve(currentDir, projectName);

        // Check if directory exists
        if (fs.existsSync(projectDir)) {
            console.log(`❌ Directory ${projectName} already exists in the current location!`);
            console.log('💡 Please choose a different name or remove the existing directory');
            process.exit(1);
        }

        console.log(`\n📁 Creating project: ${projectName}`);
        console.log(`📍 Location: ${projectDir}\n`);

        // Copy template files
        console.log('📋 Copying template files...');
        const templateDir = path.resolve(__dirname);

        await fs.copy(templateDir, projectDir, {
            filter: (src) => {
                // Exclude template-specific files and directories
                const excludePatterns = [
                    '.git',
                    'node_modules',
                    'package-lock.json',
                    'TEMPLATE_README.md',
                    'template-setup.md',
                    'setup-template.sh',
                    'env.template',
                    'generate-project.js',
                    'dist',
                    '.DS_Store'
                ];

                return !excludePatterns.some(pattern =>
                    src.includes(pattern) || src.endsWith(pattern)
                );
            }
        });

        // Navigate to project directory
        process.chdir(projectDir);

        // Update package.json
        console.log('📝 Updating package.json...');
        const packagePath = path.join(projectDir, 'package.json');
        const packageJson = await fs.readJson(packagePath);

        packageJson.name = projectName;
        packageJson.description = projectDescription;
        packageJson.author = authorName;
        packageJson.license = license;
        packageJson.version = '1.0.0';

        await fs.writeJson(packagePath, packageJson, { spaces: 2 });

        // Create environment files
        console.log('🔐 Creating environment files...');
        const envTemplate = `# Server Configuration
PORT=${port}
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/${projectName}
MONGO_DB_NAME=${projectName}

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
ALLOWED_METHODS=GET,POST,PUT,DELETE,PATCH,OPTIONS
ALLOWED_HEADERS=Content-Type,Authorization,X-Requested-With

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging Configuration
LOG_LEVEL=info
LOG_FORMAT=combined`;

        await fs.writeFile(path.join(projectDir, '.env.development'), envTemplate);
        await fs.writeFile(path.join(projectDir, '.env.production'), envTemplate);

        // Initialize git repository
        console.log('🔧 Initializing git repository...');
        try {
            execSync('git init', { stdio: 'inherit' });
        } catch (error) {
            console.log('⚠️  Git initialization failed, continuing without git...');
        }

        // Install dependencies
        console.log('📦 Installing dependencies...');
        try {
            execSync('npm install', { stdio: 'inherit' });
        } catch (error) {
            console.log('⚠️  Dependencies installation failed, you can run "npm install" manually later');
        }

        // Create initial commit if git is available
        if (fs.existsSync(path.join(projectDir, '.git'))) {
            try {
                console.log('💾 Creating initial commit...');
                execSync('git add .', { stdio: 'inherit' });
                execSync('git commit -m "Initial commit: Setup from backend server template"', { stdio: 'inherit' });
            } catch (error) {
                console.log('⚠️  Git commit failed, you can commit manually later');
            }
        }

        console.log('\n✅ Project setup complete!');
        console.log('==============================');
        console.log(`📁 Project location: ${projectDir}`);
        console.log('🚀 To start development:');
        console.log(`   cd ${projectName}`);
        console.log('   npm run dev');
        console.log('\n🔧 Next steps:');
        console.log('   1. Update .env.development with your configuration');
        console.log('   2. Modify package.json with your project details');
        console.log('   3. Update README.md with your project information');
        console.log('   4. Add your first route and controller');
        console.log('   5. Start coding! 🎉');

    } catch (error) {
        console.error('❌ Error creating project:', error.message);
        process.exit(1);
    } finally {
        rl.close();
    }
}

// Run the generator
generateProject();