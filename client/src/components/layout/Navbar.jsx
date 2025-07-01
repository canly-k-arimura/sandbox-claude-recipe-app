import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import './Navbar.css'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Recipe Share
        </Link>
        
        <div className="navbar-menu">
          <Link to="/recipes" className="navbar-item">
            Recipes
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/create-recipe" className="navbar-item">
                Create Recipe
              </Link>
              <Link to="/profile" className="navbar-item">
                Profile
              </Link>
              <span className="navbar-user">
                Hello, {user?.username}!
              </span>
              <button onClick={handleLogout} className="navbar-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-item">
                Login
              </Link>
              <Link to="/register" className="navbar-item">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar