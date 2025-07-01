#!/bin/bash

# Docker MongoDB Setup Test Script

echo "🐳 Recipe App Docker Setup Test"
echo "================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"

# Check if containers are running
echo "📊 Checking container status..."
if docker ps | grep -q "recipe-app-mongodb"; then
    echo "✅ MongoDB container is running"
else
    echo "❌ MongoDB container is not running"
    exit 1
fi

if docker ps | grep -q "recipe-app-mongo-express"; then
    echo "✅ Mongo Express container is running"
else
    echo "❌ Mongo Express container is not running"
    exit 1
fi

# Test MongoDB connection
echo "🔌 Testing MongoDB connection..."
if docker exec recipe-app-mongodb mongosh --quiet --eval "db.adminCommand('ping').ok" > /dev/null 2>&1; then
    echo "✅ MongoDB is responding"
else
    echo "❌ MongoDB is not responding"
    exit 1
fi

echo ""
echo "🎉 All systems are running successfully!"
echo ""
echo "📍 Access Points:"
echo "   MongoDB:     localhost:27017"
echo "   Mongo Express: http://localhost:8081"
echo "   Backend API:   http://localhost:3001"
echo ""
echo "🚀 Next Steps:"
echo "   1. Start your Node.js server: cd server && yarn dev"
echo "   2. Start your React client: cd client && yarn dev"
echo "   3. Visit http://localhost:5173 to see your app"
echo "   4. Add sample data: cd server && yarn seed"