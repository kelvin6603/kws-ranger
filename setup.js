const fs = require('fs');
const path = require('path');

// Define required directories
const directories = [
    'uploads',
    'logs',
    'models/wildlife_model',
    'public/images',
    'public/uploads'
];

// Create directories if they don't exist
directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// Create a basic .gitignore file if it doesn't exist
const gitignoreContent = `
# Dependencies
node_modules/
npm-debug.log
yarn-debug.log
yarn-error.log

# Environment variables
.env

# Uploads and logs
uploads/*
!uploads/.gitkeep
logs/*
!logs/.gitkeep

# Build files
dist/
build/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db
`;

const gitignorePath = path.join(__dirname, '.gitignore');
if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, gitignoreContent.trim());
    console.log('Created .gitignore file');
}

// Create empty .gitkeep files to maintain directory structure
['uploads', 'logs'].forEach(dir => {
    const gitkeepPath = path.join(__dirname, dir, '.gitkeep');
    if (!fs.existsSync(gitkeepPath)) {
        fs.writeFileSync(gitkeepPath, '');
        console.log(`Created .gitkeep in ${dir}`);
    }
});

console.log('Setup completed successfully!'); 