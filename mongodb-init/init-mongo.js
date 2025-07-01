// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

print('Start #################################################################');

// Switch to the recipe-app database
db = db.getSiblingDB('recipe-app');

// Create a user for the application
db.createUser({
  user: 'recipeapp',
  pwd: 'recipeapp123',
  roles: [
    {
      role: 'readWrite',
      db: 'recipe-app'
    }
  ]
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });

db.recipes.createIndex({ "title": "text", "description": "text", "tags": "text" });
db.recipes.createIndex({ "author": 1 });
db.recipes.createIndex({ "category": 1 });
db.recipes.createIndex({ "difficulty": 1 });
db.recipes.createIndex({ "averageRating": -1 });
db.recipes.createIndex({ "createdAt": -1 });

print('End ###################################################################');