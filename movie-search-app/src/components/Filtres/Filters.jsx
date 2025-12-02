import React from 'react'
import './Filters.css'

function Filters({
  genres,
  selectedGenres,
  onGenresChange,
  yearFrom,
  yearTo,
  onYearFromChange,
  onYearToChange,
  minRating,
  onMinRatingChange,
  onApplyFilters,
  onResetFilters,
  filtersApplied,
}) {
  // Toggle genre selection
  const handleGenreToggle = genreId => {
    const newSelectedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId]
    onGenresChange(newSelectedGenres)
  }

  // Disable apply button if no filters are selected
  const isDisabled =
    selectedGenres.length === 0 && !yearFrom && !yearTo && minRating === 0

  return (
    <div className="filters-section">
      <h3>Filters</h3>

      <div className="filter-group">
        <label>Genres:</label>
        <div className="genres-list">
          {genres.map(genre => (
            <div className="genres-checkbox" key={genre.id}>
              <input
                type="checkbox"
                id={`genre-${genre.id}`}
                checked={selectedGenres.includes(genre.id)}
                onChange={() => handleGenreToggle(genre.id)}
              />
              <label htmlFor={`genre-${genre.id}`}>{genre.name}</label>
            </div>
          ))}
        </div>

        <div className="filter-group">
          <label>Release Year:</label>
          <div className="year-input">
            <input
              type="number"
              placeholder="From (e.g. 2000)"
              value={yearFrom}
              onChange={e => onYearFromChange(e.target.value)}
              min="1900"
              max={new Date().getFullYear()}
              className="year-input"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="To (e.g. 2024)"
              value={yearTo}
              onChange={e => onYearToChange(e.target.value)}
              min="1900"
              max={new Date().getFullYear()}
              className="year-input"
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Minimum Rating: {minRating.toFixed(1)} ⭐</label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={minRating}
            onChange={e => onMinRatingChange(parseFloat(e.target.value))}
            className="rating-slider"
          />
        </div>

        <div className="filter-action">
          <button
            className="apply-filter-button"
            onClick={onApplyFilters}
            disabled={isDisabled}
          >
            Apply
          </button>

          <button className="reset-filter-button" onClick={onResetFilters}>
            Reset
          </button>
        </div>

        {filtersApplied &&
          (selectedGenres.length > 0 ||
            yearFrom ||
            yearTo ||
            minRating > 0) && (
            <div className="active-filters">
              <strong>Active filters:</strong>

              {selectedGenres.length > 0 && (
                <span>
                  Genres:{' '}
                  {selectedGenres
                    .map(id => {
                      const genre = genres.find(g => g.id === id)
                      return genre ? genre.name : ''
                    })
                    .filter(Boolean)
                    .join(', ')}
                </span>
              )}

              {(yearFrom || yearTo) && (
                <span>
                  {' • '}Year: {yearFrom || '?'} - {yearTo || '?'}
                </span>
              )}

              {minRating > 0 && (
                <span>
                  {' • '}Rating: ≥ {minRating.toFixed(1)}⭐
                </span>
              )}
            </div>
          )}
      </div>
    </div>
  )
}

export default Filters
