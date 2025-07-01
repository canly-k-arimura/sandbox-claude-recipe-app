import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { recipeAPI } from '../services/api'
import useAuthStore from '../store/authStore'
import RecipeCard from '../components/recipe/RecipeCard'
import './ProfilePage.css'

const ProfilePage = () => {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('recipes')

  const { data: userRecipes, isLoading } = useQuery({
    queryKey: ['user-recipes'],
    queryFn: () => recipeAPI.getUserRecipes(),
  })

  const recipes = userRecipes?.data?.recipes || []

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                <div className="avatar-placeholder">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="profile-details">
              <h1>{user?.username}</h1>
              <p className="profile-email">{user?.email}</p>
              {user?.bio && <p className="profile-bio">{user.bio}</p>}
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-tabs">
            <button
              onClick={() => setActiveTab('recipes')}
              className={activeTab === 'recipes' ? 'active' : ''}
            >
              My Recipes ({recipes.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={activeTab === 'favorites' ? 'active' : ''}
            >
              Favorites
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'recipes' && (
              <div className="recipes-tab">
                {isLoading ? (
                  <div className="loading">Loading your recipes...</div>
                ) : recipes.length > 0 ? (
                  <div className="recipes-grid">
                    {recipes.map((recipe) => (
                      <RecipeCard key={recipe._id} recipe={recipe} />
                    ))}
                  </div>
                ) : (
                  <div className="no-recipes">
                    <h3>No recipes yet</h3>
                    <p>Start sharing your delicious recipes with the community!</p>
                    <a href="/create-recipe" className="btn btn-primary">
                      Create Your First Recipe
                    </a>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="favorites-tab">
                <div className="no-recipes">
                  <h3>No favorites yet</h3>
                  <p>Browse recipes and save your favorites here!</p>
                  <a href="/recipes" className="btn btn-primary">
                    Browse Recipes
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage