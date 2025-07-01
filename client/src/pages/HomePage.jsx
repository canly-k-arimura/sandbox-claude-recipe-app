import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { recipeAPI } from '../services/api'
import RecipeCard from '../components/recipe/RecipeCard'
import './HomePage.css'

const HomePage = () => {
  const { data: recipesData, isLoading } = useQuery({
    queryKey: ['recipes', { limit: 6, sortBy: 'createdAt' }],
    queryFn: () => recipeAPI.getRecipes({ limit: 6, sortBy: 'createdAt' }),
  })

  const featuredRecipes = recipesData?.data?.recipes || []

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Recipe Share</h1>
          <p>Discover amazing recipes and share your culinary creations with the world</p>
          <div className="hero-actions">
            <Link to="/recipes" className="btn btn-primary">
              Browse Recipes
            </Link>
            <Link to="/create-recipe" className="btn btn-secondary">
              Share Recipe
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="featured-recipes">
        <div className="container">
          <h2>Latest Recipes</h2>
          {isLoading ? (
            <div className="loading">Loading featured recipes...</div>
          ) : (
            <div className="recipes-grid">
              {featuredRecipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          )}
          {featuredRecipes.length > 0 && (
            <div className="view-all">
              <Link to="/recipes" className="btn btn-outline">
                View All Recipes
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Recipe Share?</h2>
          <div className="features-grid">
            <div className="feature">
              <h3>🍳 Easy Recipe Creation</h3>
              <p>Create and organize your recipes with our intuitive recipe builder</p>
            </div>
            <div className="feature">
              <h3>⭐ Rate & Review</h3>
              <p>Share your experience and help others discover great recipes</p>
            </div>
            <div className="feature">
              <h3>🔍 Smart Search</h3>
              <p>Find recipes by ingredients, cuisine, difficulty, and more</p>
            </div>
            <div className="feature">
              <h3>📱 Mobile Friendly</h3>
              <p>Access your recipes anywhere, anytime on any device</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage