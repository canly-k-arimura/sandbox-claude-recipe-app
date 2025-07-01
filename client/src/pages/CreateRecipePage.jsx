import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { recipeAPI } from '../services/api'
import './CreateRecipePage.css'

const CATEGORIES = [
  'Appetizer',
  'Main Course', 
  'Dessert',
  'Beverage',
  'Soup',
  'Salad',
  'Side Dish',
  'Breakfast'
]

const CreateRecipePage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'Medium',
    category: '',
    tags: '',
    ingredients: [{ name: '', amount: '', unit: '' }],
    instructions: [{ instruction: '' }]
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients]
    newIngredients[index][field] = value
    setFormData(prev => ({ ...prev, ingredients: newIngredients }))
  }

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '', unit: '' }]
    }))
  }

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, ingredients: newIngredients }))
    }
  }

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...formData.instructions]
    newInstructions[index].instruction = value
    setFormData(prev => ({ ...prev, instructions: newInstructions }))
  }

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, { instruction: '' }]
    }))
  }

  const removeInstruction = (index) => {
    if (formData.instructions.length > 1) {
      const newInstructions = formData.instructions.filter((_, i) => i !== index)
      // Update step numbers
      const updatedInstructions = newInstructions.map((inst, i) => ({
        ...inst,
        stepNumber: i + 1
      }))
      setFormData(prev => ({ ...prev, instructions: updatedInstructions }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const recipeData = {
        ...formData,
        prepTime: parseInt(formData.prepTime),
        cookTime: parseInt(formData.cookTime),
        servings: parseInt(formData.servings),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        instructions: formData.instructions.map((inst, index) => ({
          ...inst,
          stepNumber: index + 1
        }))
      }

      const response = await recipeAPI.createRecipe(recipeData)
      toast.success('Recipe created successfully!')
      navigate(`/recipes/${response.data.recipe._id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create recipe')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="create-recipe-page">
      <div className="container">
        <h1>Create New Recipe</h1>
        
        <form onSubmit={handleSubmit} className="recipe-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label>Recipe Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter recipe title"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Brief description of your recipe"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Prep Time (minutes) *</label>
                <input
                  type="number"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Cook Time (minutes) *</label>
                <input
                  type="number"
                  name="cookTime"
                  value={formData.cookTime}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Servings *</label>
                <input
                  type="number"
                  name="servings"
                  value={formData.servings}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g. vegetarian, quick, healthy"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Ingredients</h3>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-row">
                <input
                  type="text"
                  placeholder="Ingredient name"
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Amount"
                  value={ingredient.amount}
                  onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={ingredient.unit}
                  onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="remove-btn"
                  disabled={formData.ingredients.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addIngredient} className="add-btn">
              Add Ingredient
            </button>
          </div>

          <div className="form-section">
            <h3>Instructions</h3>
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="instruction-row">
                <span className="step-number">{index + 1}</span>
                <textarea
                  placeholder="Describe this step"
                  value={instruction.instruction}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  required
                  rows="2"
                />
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="remove-btn"
                  disabled={formData.instructions.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addInstruction} className="add-btn">
              Add Step
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isLoading} className="submit-btn">
              {isLoading ? 'Creating Recipe...' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateRecipePage