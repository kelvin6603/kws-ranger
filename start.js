const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Check if MongoDB is running
function checkMongoDB() {
    try {
        execSync('mongod --version', { stdio: 'ignore' });
        console.log('✓ MongoDB is installed');
        return true;
    } catch (error) {
        console.error('✗ MongoDB is not installed or not running');
        console.error('Please install MongoDB and ensure it is running');
        return false;
    }
}

// Check if required directories exist
function checkDirectories() {
    const requiredDirs = [
        'uploads',
        'logs',
        'models',
        'controllers',
        'routes',
        'middleware',
        'utils',
        'config'
    ];

    const missingDirs = requiredDirs.filter(dir => !fs.existsSync(dir));

    if (missingDirs.length > 0) {
        console.log('Creating missing directories...');
        missingDirs.forEach(dir => {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`✓ Created directory: ${dir}`);
        });
    } else {
        console.log('✓ All required directories exist');
    }
}

// Check if .env file exists and has required variables
function checkEnvFile() {
    const requiredEnvVars = [
        'PORT',
        'MONGODB_URI',
        'JWT_SECRET',
        'JWT_EXPIRE',
        'NODE_ENV'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error('✗ Missing required environment variables:');
        missingVars.forEach(varName => {
            console.error(`   - ${varName}`);
        });
        return false;
    }

    console.log('✓ Environment variables are properly configured');
    return true;
}

// Check if required dependencies are installed
function checkDependencies() {
    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const dependencies = Object.keys(packageJson.dependencies || {});
        const devDependencies = Object.keys(packageJson.devDependencies || {});

        const requiredDeps = [
            'express',
            'mongoose',
            'socket.io',
            'bcryptjs',
            'jsonwebtoken',
            'multer',
            'cors',
            'dotenv'
        ];

        const missingDeps = requiredDeps.filter(dep => 
            !dependencies.includes(dep) && !devDependencies.includes(dep)
        );

        if (missingDeps.length > 0) {
            console.error('✗ Missing required dependencies:');
            missingDeps.forEach(dep => {
                console.error(`   - ${dep}`);
            });
            return false;
        }

        console.log('✓ All required dependencies are installed');
        return true;
    } catch (error) {
        console.error('✗ Error checking dependencies:', error.message);
        return false;
    }
}

// Main function to start the application
async function startApplication() {
    console.log('Starting application...\n');

    // Check prerequisites
    if (!checkMongoDB()) {
        process.exit(1);
    }

    checkDirectories();

    if (!checkEnvFile()) {
        process.exit(1);
    }

    if (!checkDependencies()) {
        console.log('\nInstalling missing dependencies...');
        try {
            execSync('npm install', { stdio: 'inherit' });
        } catch (error) {
            console.error('✗ Error installing dependencies:', error.message);
            process.exit(1);
        }
    }

    // Initialize database
    console.log('\nInitializing database...');
    try {
        execSync('node scripts/initDb.js', { stdio: 'inherit' });
    } catch (error) {
        console.error('✗ Error initializing database:', error.message);
        process.exit(1);
    }

    // Seed database with initial data
    console.log('\nSeeding database...');
    try {
        execSync('node scripts/seedDb.js', { stdio: 'inherit' });
    } catch (error) {
        console.error('✗ Error seeding database:', error.message);
        process.exit(1);
    }

    // Start the server
    console.log('\nStarting server...');
    try {
        execSync('node server.js', { stdio: 'inherit' });
    } catch (error) {
        console.error('✗ Error starting server:', error.message);
        process.exit(1);
    }
}

// Run the start function
startApplication().catch(error => {
    console.error('✗ Fatal error:', error.message);
    process.exit(1);
}); 