const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true
  }
});

const instructionSchema = new mongoose.Schema({
  stepNumber: {
    type: Number,
    required: true
  },
  instruction: {
    type: String,
    required: true,
    trim: true
  }
});

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Recipe description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  ingredients: [ingredientSchema],
  instructions: [instructionSchema],
  prepTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: [1, 'Prep time must be at least 1 minute']
  },
  cookTime: {
    type: Number,
    required: [true, 'Cooking time is required'],
    min: [1, 'Cook time must be at least 1 minute']
  },
  servings: {
    type: Number,
    required: [true, 'Number of servings is required'],
    min: [1, 'Must serve at least 1 person']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  category: {
    type: String,
    required: [true, 'Recipe category is required'],
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Soup', 'Salad', 'Side Dish', 'Breakfast']
  },
  tags: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ratings: [ratingSchema],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

recipeSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.ratingCount = 0;
    return;
  }
  
  const sum = this.ratings.reduce((total, rating) => total + rating.rating, 0);
  this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
  this.ratingCount = this.ratings.length;
};

recipeSchema.pre('save', function(next) {
  this.calculateAverageRating();
  next();
});

module.exports = mongoose.model('Recipe', recipeSchema);