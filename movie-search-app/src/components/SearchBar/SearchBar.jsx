import React, { useState, useEffect } from 'react'
import './SearchBar.css'

function SearchBar({
  searchQuery,
  onSearchChange,
  searchHistory,
  onClearHistory,
  onSelectHistory,
  onClearSearch,
}) {
  const [showHistory, setShowHistory] = useState(false)

  // Close history dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (
        !e.target.closest('.search-input-wrapper') &&
        !e.target.closest('.search-history-dropdown')
      ) {
        setShowHistory(false)
      }
    }

    if (showHistory) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => document.removeEventListener('click', handleClickOutside)
  }, [showHistory])

  return (
    <header className="header">
      <h1>Movie Search</h1>
      <form onSubmit={e => e.preventDefault()} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search the movie..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            className="search-input"
          />

          {showHistory &&
            searchHistory.length > 0 &&
            searchQuery.length < 3 && (
              <div className="search-history-dropdown">
                {searchHistory.map((query, index) => (
                  <button
                    type="button"
                    className="history-item"
                    key={index}
                    onClick={() => {
                      setShowHistory(false)
                      onSelectHistory(query)
                    }}
                  >
                    {query}
                  </button>
                ))}

                <button
                  type="button"
                  className="clear-history-btn"
                  onClick={() => {
                    onClearHistory()
                    setShowHistory(false)
                  }}
                >
                  Clear History
                </button>
              </div>
            )}
        </div>

        <button type="button" onClick={onClearSearch} className="clear-button">
          ✕
        </button>
      </form>
    </header>
  )
}

export default SearchBar
