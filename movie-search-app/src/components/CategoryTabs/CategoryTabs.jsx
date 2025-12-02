import React from 'react'
import './CategoryTabs.css'

function CategoryTabs({ activeCategory, onCategoryChange, favoritesCount }) {
  const categories = [
    { id: 'popular', label: 'Popular' },
    { id: 'top_rated', label: 'Top Rated' },
    { id: 'now_playing', label: 'Now Playing' },
    { id: 'favorites', label: `❤️ Favorites (${favoritesCount})` },
  ]

  return (
    <div className="category-tabs">
      {categories.map(cat => (
        <button
          key={cat.id}
          type="button"
          className={activeCategory === cat.id ? 'tab active' : 'tab'}
          onClick={() => onCategoryChange(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}

export default CategoryTabs
