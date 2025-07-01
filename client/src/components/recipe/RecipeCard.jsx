import { Link } from 'react-router-dom'
import './RecipeCard.css'

const RecipeCard = ({ recipe }) => {
  const {
    _id,
    title,
    description,
    image,
    prepTime,
    cookTime,
    difficulty,
    averageRating,
    ratingCount,
    author
  } = recipe

  const totalTime = prepTime + cookTime

  return (
    <div className="recipe-card">
      <Link to={`/recipes/${_id}`} className="recipe-card-link">
        <div className="recipe-image">
          {image ? (
            <img src={image} alt={title} />
          ) : (
            <div className="recipe-image-placeholder">
              <span>🍽️</span>
            </div>
          )}
          <div className="recipe-difficulty">
            {difficulty}
          </div>
        </div>
        
        <div className="recipe-content">
          <h3 className="recipe-title">{title}</h3>
          <p className="recipe-description">{description}</p>
          
          <div className="recipe-meta">
            <div className="recipe-time">
              <span>⏱️ {totalTime} min</span>
            </div>
            <div className="recipe-rating">
              {averageRating > 0 ? (
                <>
                  <span>⭐ {averageRating.toFixed(1)}</span>
                  <span className="rating-count">({ratingCount})</span>
                </>
              ) : (
                <span className="no-rating">No ratings yet</span>
              )}
            </div>
          </div>
          
          <div className="recipe-author">
            By {author?.username || 'Anonymous'}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default RecipeCard