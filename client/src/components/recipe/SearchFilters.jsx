import { useState } from 'react'
import './SearchFilters.css'

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

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' },
  { value: 'averageRating-desc', label: 'Highest Rated' },
  { value: 'title-asc', label: 'Alphabetical A-Z' },
  { value: 'title-desc', label: 'Alphabetical Z-A' }
]

const SearchFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  const handleSearchChange = (e) => {
    const search = e.target.value
    const newFilters = { ...filters, search }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split('-')
    const newFilters = { ...filters, sortBy, sortOrder }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      difficulty: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  return (
    <div className="search-filters">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search recipes by title, description, or tags..."
          value={filters.search}
          onChange={handleSearchChange}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="filters-row">
        <div className="filter-group">
          <label>Category:</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Difficulty:</label>
          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
          >
            <option value="">All Levels</option>
            {DIFFICULTIES.map(difficulty => (
              <option key={difficulty} value={difficulty}>{difficulty}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={handleSortChange}
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button onClick={clearFilters} className="clear-filters-btn">
          Clear All
        </button>
      </div>
    </div>
  )
}

export default SearchFilters