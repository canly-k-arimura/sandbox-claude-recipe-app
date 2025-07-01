import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { recipeAPI } from '../services/api'
import RecipeCard from '../components/recipe/RecipeCard'
import SearchFilters from '../components/recipe/SearchFilters'
import './RecipesPage.css'

const RecipesPage = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
    category: '',
    difficulty: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  const { data: recipesData, isLoading, error } = useQuery({
    queryKey: ['recipes', filters],
    queryFn: () => recipeAPI.getRecipes(filters),
    keepPreviousData: true
  })

  const recipes = recipesData?.data?.recipes || []
  const pagination = recipesData?.data?.pagination || {}

  const handleFiltersChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (error) {
    return (
      <div className="recipes-page">
        <div className="container">
          <div className="error-message">
            Failed to load recipes. Please try again later.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="recipes-page">
      <div className="container">
        <div className="page-header">
          <h1>All Recipes</h1>
          <p>Discover delicious recipes from our community</p>
        </div>

        <SearchFilters onFiltersChange={handleFiltersChange} />

        {isLoading ? (
          <div className="loading">Loading recipes...</div>
        ) : (
          <>
            <div className="recipes-results">
              <p>{pagination.totalRecipes || 0} recipes found</p>
            </div>

            {recipes.length > 0 ? (
              <>
                <div className="recipes-grid">
                  {recipes.map((recipe) => (
                    <RecipeCard key={recipe._id} recipe={recipe} />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="pagination-btn"
                    >
                      Previous
                    </button>
                    
                    <span className="pagination-info">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="pagination-btn"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-recipes">
                <h3>No recipes found</h3>
                <p>Try adjusting your search filters or create a new recipe!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default RecipesPage