#!/bin/bash

# Git Setup Script for Recipe App

echo "🔧 Setting up Git repository for Recipe App..."

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if .gitignore exists
if [ ! -f ".gitignore" ]; then
    echo "❌ .gitignore file not found. Please create it first."
    exit 1
fi

echo "📋 Current Git status:"
git status --short

echo ""
echo "📝 Files that will be tracked:"
echo "   - Source code files (*.js, *.jsx, *.css)"
echo "   - Configuration files (package.json, docker-compose.yml)"
echo "   - Documentation (README.md)"
echo "   - Scripts and Dockerfiles"
echo ""
echo "🚫 Files that will be ignored:"
echo "   - node_modules/"
echo "   - .env files"
echo "   - build/dist directories"
echo "   - logs and temporary files"
echo ""

read -p "🤔 Do you want to add all tracked files to Git? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "➕ Adding files to Git..."
    
    # Add all files except those in .gitignore
    git add .
    
    echo "✅ Files added to staging area"
    echo ""
    echo "📊 Git status after adding files:"
    git status --short
    echo ""
    
    read -p "💾 Create initial commit? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "💾 Creating initial commit..."
        git commit -m "Initial commit: Recipe Share App

🎉 Features included:
- React frontend with Vite
- Node.js/Express backend
- MongoDB database models
- Docker configuration
- User authentication
- Recipe CRUD operations
- Search and filtering
- Responsive design

🚀 Ready for development!"
        
        echo "✅ Initial commit created successfully!"
        echo ""
        echo "🔗 Next steps:"
        echo "   1. Create a GitHub repository"
        echo "   2. Add remote origin: git remote add origin <repository-url>"
        echo "   3. Push to GitHub: git push -u origin main"
    else
        echo "⏭️  Skipped initial commit"
    fi
else
    echo "⏭️  Skipped adding files to Git"
fi

echo ""
echo "🎉 Git setup completed!"