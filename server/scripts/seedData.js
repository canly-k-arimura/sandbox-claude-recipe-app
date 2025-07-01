const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
require('dotenv').config();

const sampleUsers = [
  {
    username: 'chef_maria',
    email: 'maria@example.com',
    password: 'password123',
    bio: 'Professional chef with 15 years of experience in Italian cuisine.'
  },
  {
    username: 'home_cook_john',
    email: 'john@example.com',
    password: 'password123',
    bio: 'Home cooking enthusiast who loves experimenting with new flavors.'
  },
  {
    username: 'baker_sarah',
    email: 'sarah@example.com',  
    password: 'password123',
    bio: 'Pastry chef specializing in artisan breads and desserts.'
  }
];

const sampleRecipes = [
  {
    title: 'Classic Spaghetti Carbonara',
    description: 'A traditional Roman pasta dish with eggs, cheese, and pancetta.',
    ingredients: [
      { name: 'Spaghetti', amount: '400', unit: 'g' },
      { name: 'Pancetta', amount: '150', unit: 'g' },
      { name: 'Eggs', amount: '3', unit: 'large' },
      { name: 'Parmigiano-Reggiano', amount: '100', unit: 'g' },
      { name: 'Black pepper', amount: '1', unit: 'tsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Bring a large pot of salted water to boil and cook spaghetti according to package directions.' },
      { stepNumber: 2, instruction: 'While pasta cooks, cut pancetta into small cubes and cook in a large skillet until crispy.' },
      { stepNumber: 3, instruction: 'In a bowl, whisk together eggs, grated cheese, and black pepper.' },
      { stepNumber: 4, instruction: 'Drain pasta, reserving 1 cup pasta water. Add hot pasta to the skillet with pancetta.' },
      { stepNumber: 5, instruction: 'Remove from heat and quickly stir in egg mixture, adding pasta water as needed to create a creamy sauce.' }
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'Medium',
    category: 'Main Course',
    tags: ['pasta', 'italian', 'quick']
  },
  {
    title: 'Chocolate Chip Cookies',
    description: 'Soft and chewy chocolate chip cookies that are perfect for any occasion.',
    ingredients: [
      { name: 'All-purpose flour', amount: '2.25', unit: 'cups' },
      { name: 'Butter', amount: '1', unit: 'cup' },
      { name: 'Brown sugar', amount: '0.75', unit: 'cup' },
      { name: 'White sugar', amount: '0.75', unit: 'cup' },
      { name: 'Eggs', amount: '2', unit: 'large' },
      { name: 'Vanilla extract', amount: '2', unit: 'tsp' },
      { name: 'Baking soda', amount: '1', unit: 'tsp' },
      { name: 'Salt', amount: '1', unit: 'tsp' },
      { name: 'Chocolate chips', amount: '2', unit: 'cups' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Preheat oven to 375°F (190°C).' },
      { stepNumber: 2, instruction: 'In a large bowl, cream together butter and both sugars until light and fluffy.' },
      { stepNumber: 3, instruction: 'Beat in eggs one at a time, then stir in vanilla.' },
      { stepNumber: 4, instruction: 'In a separate bowl, combine flour, baking soda, and salt.' },
      { stepNumber: 5, instruction: 'Gradually blend in flour mixture, then stir in chocolate chips.' },
      { stepNumber: 6, instruction: 'Drop rounded tablespoons of dough onto ungreased cookie sheets.' },
      { stepNumber: 7, instruction: 'Bake for 9-11 minutes or until golden brown. Cool on baking sheet for 2 minutes.' }
    ],
    prepTime: 15,
    cookTime: 11,
    servings: 48,
    difficulty: 'Easy',
    category: 'Dessert',
    tags: ['cookies', 'dessert', 'chocolate', 'baking']
  },
  {
    title: 'Mediterranean Quinoa Salad',
    description: 'A healthy and refreshing salad packed with Mediterranean flavors.',
    ingredients: [
      { name: 'Quinoa', amount: '1', unit: 'cup' },
      { name: 'Cherry tomatoes', amount: '2', unit: 'cups' },
      { name: 'Cucumber', amount: '1', unit: 'large' },
      { name: 'Red onion', amount: '0.5', unit: 'cup' },
      { name: 'Feta cheese', amount: '1', unit: 'cup' },
      { name: 'Kalamata olives', amount: '0.5', unit: 'cup' },
      { name: 'Fresh parsley', amount: '0.5', unit: 'cup' },
      { name: 'Olive oil', amount: '0.25', unit: 'cup' },
      { name: 'Lemon juice', amount: '2', unit: 'tbsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Rinse quinoa and cook according to package directions. Let cool completely.' },
      { stepNumber: 2, instruction: 'Halve cherry tomatoes and dice cucumber.' },
      { stepNumber: 3, instruction: 'Finely dice red onion and crumble feta cheese.' },
      { stepNumber: 4, instruction: 'In a large bowl, combine cooled quinoa, tomatoes, cucumber, onion, feta, and olives.' },
      { stepNumber: 5, instruction: 'Whisk together olive oil and lemon juice for dressing.' },
      { stepNumber: 6, instruction: 'Pour dressing over salad, add parsley, and toss gently to combine.' },
      { stepNumber: 7, instruction: 'Chill for at least 30 minutes before serving.' }
    ],
    prepTime: 20,
    cookTime: 15,
    servings: 6,
    difficulty: 'Easy',
    category: 'Salad',
    tags: ['healthy', 'mediterranean', 'vegetarian', 'quinoa']
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe-app');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Recipe.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`Created user: ${userData.username}`);
    }

    // Create recipes
    for (let i = 0; i < sampleRecipes.length; i++) {
      const recipeData = {
        ...sampleRecipes[i],
        author: createdUsers[i % createdUsers.length]._id
      };
      
      const recipe = new Recipe(recipeData);
      await recipe.save();
      console.log(`Created recipe: ${recipeData.title}`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();