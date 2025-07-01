import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { recipeAPI } from '../services/api'
import './RecipeDetailPage.css'

const RecipeDetailPage = () => {
  const { id } = useParams()
  
  const { data: recipeData, isLoading, error } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => recipeAPI.getRecipe(id),
    enabled: !!id
  })

  const recipe = recipeData?.data?.recipe

  if (isLoading) {
    return (
      <div className="recipe-detail-page">
        <div className="container">
          <div className="loading">Loading recipe...</div>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="recipe-detail-page">
        <div className="container">
          <div className="error-message">Recipe not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="recipe-detail-page">
      <div className="container">
        <div className="recipe-header">
          <h1>{recipe.title}</h1>
          <p className="recipe-description">{recipe.description}</p>
          <div className="recipe-author">
            By {recipe.author?.username} • {new Date(recipe.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="recipe-content">
          <div className="recipe-info">
            <div className="recipe-stats">
              <div className="stat">
                <span className="stat-label">Prep Time</span>
                <span className="stat-value">{recipe.prepTime} min</span>
              </div>
              <div className="stat">
                <span className="stat-label">Cook Time</span>
                <span className="stat-value">{recipe.cookTime} min</span>
              </div>
              <div className="stat">
                <span className="stat-label">Servings</span>
                <span className="stat-value">{recipe.servings}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Difficulty</span>
                <span className="stat-value">{recipe.difficulty}</span>
              </div>
            </div>

            <div className="recipe-ingredients">
              <h3>Ingredients</h3>
              <ul>
                {recipe.ingredients?.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="recipe-instructions">
            <h3>Instructions</h3>
            <ol>
              {recipe.instructions?.map((instruction, index) => (
                <li key={index}>
                  {instruction.instruction}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="recipe-rating">
          <h3>Rating: {recipe.averageRating > 0 ? `${recipe.averageRating}/5` : 'No ratings yet'}</h3>
          {recipe.ratingCount > 0 && (
            <p>Based on {recipe.ratingCount} review{recipe.ratingCount !== 1 ? 's' : ''}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailPage