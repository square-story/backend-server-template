#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

// Test script to verify package functionality
async function testPackage() {
    console.log('🧪 Testing Backend Server Template Package');
    console.log('=========================================\n');

    try {
        // Test 1: Check if all required files exist
        console.log('📁 Checking required files...');
        const requiredFiles = [
            'package.json',
            'generate-project.js',
            'src/app.ts',
            'src/server.ts',
            'tsconfig.json',
            'README.md'
        ];

        for (const file of requiredFiles) {
            if (fs.existsSync(file)) {
                console.log(`✅ ${file}`);
            } else {
                console.log(`❌ ${file} - MISSING`);
                return false;
            }
        }

        // Test 2: Check package.json configuration
        console.log('\n📦 Checking package.json...');
        const packageJson = require('../package.json');

        if (packageJson.name === 'backend-server-template') {
            console.log('✅ Package name is correct');
        } else {
            console.log('❌ Package name is incorrect');
            return false;
        }

        if (packageJson.bin && packageJson.bin['create-backend-server']) {
            console.log('✅ Binary configuration is correct');
        } else {
            console.log('❌ Binary configuration is missing');
            return false;
        }

        if (packageJson.main === 'generate-project.js') {
            console.log('✅ Main entry point is correct');
        } else {
            console.log('❌ Main entry point is incorrect');
            return false;
        }

        // Test 3: Check if generate script is executable
        console.log('\n🔧 Checking generate script...');
        const generateScript = path.resolve(__dirname, '../generate-project.js');
        const stats = fs.statSync(generateScript);

        if (stats.mode & 0o111) {
            console.log('✅ Generate script is executable');
        } else {
            console.log('❌ Generate script is not executable');
            return false;
        }

        // Test 4: Check TypeScript compilation
        console.log('\n🔨 Testing TypeScript compilation...');
        try {
            const { execSync } = require('child_process');
            execSync('npm run build', { stdio: 'pipe' });
            console.log('✅ TypeScript compilation successful');
        } catch (error) {
            console.log('❌ TypeScript compilation failed');
            return false;
        }

        // Test 5: Check if dist directory was created
        if (fs.existsSync('dist')) {
            console.log('✅ Build output directory exists');
        } else {
            console.log('❌ Build output directory missing');
            return false;
        }

        console.log('\n🎉 All tests passed! Package is ready for publishing.');
        return true;

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        return false;
    }
}

// Run tests
if (require.main === module) {
    testPackage().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = { testPackage }; 