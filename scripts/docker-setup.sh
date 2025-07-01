#!/bin/bash

# Recipe App Docker Setup Script

echo "🐳 Setting up Recipe App with Docker..."

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker Desktop and try again."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to start MongoDB only
start_mongodb() {
    echo "🍃 Starting MongoDB container..."
    docker-compose up -d mongodb mongo-express
    echo "✅ MongoDB is running on localhost:27017"
    echo "✅ Mongo Express (Database UI) is running on http://localhost:8081"
}

# Function to start full development environment
start_dev() {
    echo "🚀 Starting full development environment..."
    docker-compose -f docker-compose.dev.yml up --build
}

# Function to stop all containers
stop_containers() {
    echo "🛑 Stopping all containers..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    echo "✅ All containers stopped"
}

# Function to clean up Docker resources
cleanup() {
    echo "🧹 Cleaning up Docker resources..."
    docker-compose down -v
    docker-compose -f docker-compose.dev.yml down -v
    docker system prune -f
    echo "✅ Cleanup completed"
}

# Function to show container status
status() {
    echo "📊 Container Status:"
    docker-compose ps
    echo ""
    docker-compose -f docker-compose.dev.yml ps
}

# Function to view logs
logs() {
    if [ -z "$1" ]; then
        echo "📋 All container logs:"
        docker-compose logs -f
    else
        echo "📋 Logs for $1:"
        docker-compose logs -f "$1"
    fi
}

# Function to seed database
seed_database() {
    echo "🌱 Seeding database with sample data..."
    if docker ps | grep -q recipe-app-server; then
        docker exec recipe-app-server yarn seed
    else
        echo "❌ Server container is not running. Please start the development environment first."
        exit 1
    fi
}

# Main script logic
case "$1" in
    "mongodb"|"mongo")
        check_docker
        start_mongodb
        ;;
    "dev"|"development")
        check_docker
        start_dev
        ;;
    "stop")
        stop_containers
        ;;
    "cleanup"|"clean")
        cleanup
        ;;
    "status")
        status
        ;;
    "logs")
        logs $2
        ;;
    "seed")
        seed_database
        ;;
    *)
        echo "Recipe App Docker Management"
        echo ""
        echo "Usage: $0 {mongodb|dev|stop|cleanup|status|logs|seed}"
        echo ""
        echo "Commands:"
        echo "  mongodb    - Start only MongoDB and Mongo Express"
        echo "  dev        - Start full development environment"
        echo "  stop       - Stop all containers"
        echo "  cleanup    - Stop containers and clean up volumes"
        echo "  status     - Show container status"
        echo "  logs       - Show container logs (optional: specify container name)"
        echo "  seed       - Seed database with sample data"
        echo ""
        echo "Examples:"
        echo "  $0 mongodb     # Start only MongoDB"
        echo "  $0 dev         # Start full development stack"
        echo "  $0 logs server # Show server logs"
        echo "  $0 seed        # Add sample data to database"
        exit 1
        ;;
esac