const express = require('express');
const Recipe = require('../models/Recipe');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all recipes with pagination and filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      difficulty,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const recipes = await Recipe.find(filter)
      .populate('author', 'username avatar')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Recipe.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      recipes,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRecipes: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipes'
    });
  }
});

// Get single recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('ratings.user', 'username avatar');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      recipe
    });
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipe'
    });
  }
});

// Create new recipe
router.post('/', authenticateToken, async (req, res) => {
  try {
    const recipeData = {
      ...req.body,
      author: req.user._id
    };

    const recipe = new Recipe(recipeData);
    await recipe.save();
    
    await recipe.populate('author', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      recipe
    });
  } catch (error) {
    console.error('Create recipe error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create recipe'
    });
  }
});

// Update recipe
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if user is the author
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this recipe'
      });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username avatar');

    res.json({
      success: true,
      message: 'Recipe updated successfully',
      recipe: updatedRecipe
    });
  } catch (error) {
    console.error('Update recipe error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update recipe'
    });
  }
});

// Delete recipe
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if user is the author
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this recipe'
      });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete recipe'
    });
  }
});

// Add rating to recipe
router.post('/:id/rating', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if user already rated this recipe
    const existingRatingIndex = recipe.ratings.findIndex(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      recipe.ratings[existingRatingIndex] = {
        user: req.user._id,
        rating,
        comment: comment || recipe.ratings[existingRatingIndex].comment
      };
    } else {
      // Add new rating
      recipe.ratings.push({
        user: req.user._id,
        rating,
        comment: comment || ''
      });
    }

    await recipe.save();
    await recipe.populate('ratings.user', 'username avatar');

    res.json({
      success: true,
      message: 'Rating added successfully',
      recipe
    });
  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add rating'
    });
  }
});

// Get user's own recipes
router.get('/user/my-recipes', authenticateToken, async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user._id })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      recipes
    });
  } catch (error) {
    console.error('Get user recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user recipes'
    });
  }
});

module.exports = router;