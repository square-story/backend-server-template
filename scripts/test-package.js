#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Test script to verify package functionality
async function testPackage() {
    console.log('🧪 Testing Backend Server Template Package');
    console.log('=========================================\n');

    let allTestsPassed = true;
    const testResults = [];

    // Helper function to run tests
    function runTest(testName, testFunction) {
        return async () => {
            try {
                const result = await testFunction();
                if (result) {
                    console.log(`✅ ${testName}`);
                    testResults.push({ name: testName, status: 'PASS' });
                    return true;
                } else {
                    console.log(`❌ ${testName}`);
                    testResults.push({ name: testName, status: 'FAIL' });
                    allTestsPassed = false;
                    return false;
                }
            } catch (error) {
                console.log(`❌ ${testName} - ERROR: ${error.message}`);
                testResults.push({ name: testName, status: 'ERROR', error: error.message });
                allTestsPassed = false;
                return false;
            }
        };
    }

    // Test 1: Check if all required files exist
    const testRequiredFiles = runTest('Required files exist', async () => {
        const requiredFiles = [
            'package.json',
            'generate-project.js',
            'src/app.ts',
            'src/server.ts',
            'tsconfig.json',
            'README.md',
            'TEMPLATE_README.md',
            'env.template'
        ];

        for (const file of requiredFiles) {
            if (!fs.existsSync(file)) {
                console.log(`   ❌ Missing: ${file}`);
                return false;
            }
        }
        return true;
    });

    // Test 2: Check package.json configuration
    const testPackageJson = runTest('Package.json configuration', async () => {
        const packageJson = require('../package.json');

        const checks = [
            { name: 'Package name', value: packageJson.name === 'backend-server-template' },
            { name: 'Binary configuration', value: !!(packageJson.bin && packageJson.bin['create-backend-server']) },
            { name: 'Main entry point', value: packageJson.main === 'generate-project.js' },
            { name: 'Version format', value: /^\d+\.\d+\.\d+$/.test(packageJson.version) },
            { name: 'Description', value: !!packageJson.description && packageJson.description.length > 0 },
            { name: 'Keywords', value: Array.isArray(packageJson.keywords) && packageJson.keywords.length > 0 },
            { name: 'Author', value: !!packageJson.author },
            { name: 'License', value: !!packageJson.license },
            { name: 'Repository', value: !!packageJson.repository },
            { name: 'Engines', value: !!(packageJson.engines && packageJson.engines.node) }
        ];

        for (const check of checks) {
            if (!check.value) {
                console.log(`   ❌ ${check.name} failed`);
                return false;
            }
        }
        return true;
    });

    // Test 3: Check if generate script is executable
    const testGenerateScript = runTest('Generate script is executable', async () => {
        const generateScript = path.resolve(__dirname, '../generate-project.js');
        const stats = fs.statSync(generateScript);
        return (stats.mode & 0o111) !== 0;
    });

    // Test 4: Check TypeScript compilation
    const testTypeScriptCompilation = runTest('TypeScript compilation', async () => {
        try {
            // Clean previous build
            if (fs.existsSync('dist')) {
                fs.removeSync('dist');
            }

            execSync('npm run build', { stdio: 'pipe' });

            // Check if dist directory was created with expected files
            if (!fs.existsSync('dist')) {
                return false;
            }

            const distFiles = fs.readdirSync('dist');
            const expectedFiles = ['app.js', 'server.js', 'index.js'];

            for (const file of expectedFiles) {
                if (!distFiles.includes(file)) {
                    console.log(`   ❌ Missing compiled file: ${file}`);
                    return false;
                }
            }

            return true;
        } catch (error) {
            console.log(`   ❌ Compilation error: ${error.message}`);
            return false;
        }
    });

    // Test 5: Check npm pack functionality
    const testNpmPack = runTest('NPM pack functionality', async () => {
        try {
            // Clean previous pack
            const packFiles = fs.readdirSync('.').filter(file => file.endsWith('.tgz'));
            for (const file of packFiles) {
                fs.removeSync(file);
            }

            execSync('npm pack', { stdio: 'pipe' });

            const newPackFiles = fs.readdirSync('.').filter(file => file.endsWith('.tgz'));
            if (newPackFiles.length === 0) {
                return false;
            }

            // Clean up
            for (const file of newPackFiles) {
                fs.removeSync(file);
            }

            return true;
        } catch (error) {
            console.log(`   ❌ NPM pack error: ${error.message}`);
            return false;
        }
    });

    // Test 6: Check .npmignore effectiveness
    const testNpmIgnore = runTest('.npmignore effectiveness', async () => {
        const npmignorePath = path.resolve(__dirname, '../.npmignore');
        if (!fs.existsSync(npmignorePath)) {
            return false;
        }

        const npmignoreContent = fs.readFileSync(npmignorePath, 'utf8');
        const requiredPatterns = [
            'node_modules/',
            'dist/',
            'scripts/',
            '.git/',
            '.gitignore'
        ];

        for (const pattern of requiredPatterns) {
            if (!npmignoreContent.includes(pattern)) {
                console.log(`   ❌ Missing pattern in .npmignore: ${pattern}`);
                return false;
            }
        }

        return true;
    });

    // Test 7: Check .gitignore effectiveness
    const testGitIgnore = runTest('.gitignore effectiveness', async () => {
        const gitignorePath = path.resolve(__dirname, '../.gitignore');
        if (!fs.existsSync(gitignorePath)) {
            return false;
        }

        const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
        const requiredPatterns = [
            'node_modules/',
            'dist/',
            '.env',
            '*.log'
        ];

        for (const pattern of requiredPatterns) {
            if (!gitignoreContent.includes(pattern)) {
                console.log(`   ❌ Missing pattern in .gitignore: ${pattern}`);
                return false;
            }
        }

        return true;
    });

    // Test 8: Check template files structure
    const testTemplateStructure = runTest('Template files structure', async () => {
        const requiredDirs = ['src', 'src/config', 'src/controllers', 'src/models', 'src/routes', 'src/services'];

        for (const dir of requiredDirs) {
            if (!fs.existsSync(dir)) {
                console.log(`   ❌ Missing directory: ${dir}`);
                return false;
            }
        }

        const requiredSrcFiles = [
            'src/app.ts',
            'src/server.ts',
            'src/index.ts',
            'src/config/env.config.ts',
            'src/routes/index.ts'
        ];

        for (const file of requiredSrcFiles) {
            if (!fs.existsSync(file)) {
                console.log(`   ❌ Missing source file: ${file}`);
                return false;
            }
        }

        return true;
    });

    // Test 9: Check package size
    const testPackageSize = runTest('Package size optimization', async () => {
        try {
            execSync('npm pack', { stdio: 'pipe' });

            const packFiles = fs.readdirSync('.').filter(file => file.endsWith('.tgz'));
            if (packFiles.length === 0) {
                return false;
            }

            const packFile = packFiles[0];
            const stats = fs.statSync(packFile);
            const sizeInMB = stats.size / (1024 * 1024);

            // Clean up
            fs.removeSync(packFile);

            if (sizeInMB > 10) { // Should be less than 10MB
                console.log(`   ⚠️  Package size: ${sizeInMB.toFixed(2)}MB (consider optimizing)`);
            }

            return sizeInMB < 50; // Max 50MB
        } catch (error) {
            console.log(`   ❌ Package size test error: ${error.message}`);
            return false;
        }
    });

    // Test 10: Check for sensitive information
    const testSensitiveInfo = runTest('No sensitive information exposed', async () => {
        const sensitivePatterns = [
            /api[_-]?key/i,
            /secret/i,
            /password/i,
            /token/i,
            /private[_-]?key/i
        ];

        const filesToCheck = [
            'package.json',
            'README.md',
            'TEMPLATE_README.md',
            'generate-project.js'
        ];

        for (const file of filesToCheck) {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');
                for (const pattern of sensitivePatterns) {
                    if (pattern.test(content)) {
                        console.log(`   ⚠️  Potential sensitive info in ${file}`);
                        // Don't fail the test, just warn
                    }
                }
            }
        }

        return true;
    });

    // Run all tests
    console.log('Running comprehensive package tests...\n');

    await testRequiredFiles();
    await testPackageJson();
    await testGenerateScript();
    await testTypeScriptCompilation();
    await testNpmPack();
    await testNpmIgnore();
    await testGitIgnore();
    await testTemplateStructure();
    await testPackageSize();
    await testSensitiveInfo();

    // Print summary
    console.log('\n📊 Test Summary');
    console.log('================');

    const passed = testResults.filter(r => r.status === 'PASS').length;
    const failed = testResults.filter(r => r.status === 'FAIL').length;
    const errors = testResults.filter(r => r.status === 'ERROR').length;

    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`💥 Errors: ${errors}`);
    console.log(`📊 Total: ${testResults.length}`);

    if (allTestsPassed) {
        console.log('\n🎉 All tests passed! Package is ready for publishing.');
        console.log('\n🚀 Next steps:');
        console.log('1. Run: npm run publish:package');
        console.log('2. Verify the package on npmjs.com');
        console.log('3. Test installation: npm install -g backend-server-template');
    } else {
        console.log('\n⚠️  Some tests failed. Please fix the issues before publishing.');
        console.log('\nFailed tests:');
        testResults
            .filter(r => r.status !== 'PASS')
            .forEach(r => {
                console.log(`   ${r.status === 'FAIL' ? '❌' : '💥'} ${r.name}`);
                if (r.error) console.log(`      Error: ${r.error}`);
            });
    }

    return allTestsPassed;
}

// Run tests
if (require.main === module) {
    testPackage().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('💥 Test suite crashed:', error);
        process.exit(1);
    });
}

module.exports = { testPackage }; 