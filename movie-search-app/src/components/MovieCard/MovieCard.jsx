import React from 'react'
import './MovieCard.css'

function MovieCard({ movie, onCardClick, onFavoriteClick, isFavorite }) {
  const { title, release_date, poster_path, vote_average, id } = movie

  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

  const posterUrl = poster_path
    ? `${IMAGE_BASE_URL}${poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image'

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(movie)
    }
  }

  const handleFavoriteClick = e => {
    e.stopPropagation()
    if (onFavoriteClick) {
      onFavoriteClick(movie)
    }
  }
  return (
    <div className="movie-card" onClick={handleCardClick}>
      <button
        className={`movie-card_favorite-btn ${isFavorite ? 'active' : ''}`}
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>

      <img src={posterUrl} alt={title} className="movie-card_image" />

      <div className="movie-card_content">
        <h3 className="movie-card_title">{title}</h3>
        <div className="movie-card_info">
          <p className="movie-card_year">
            {release_date ? release_date.split('-')[0] : 'N/A'}
          </p>
          <p className="movie-card_rating">
            ⭐ {vote_average ? vote_average.toFixed(1) : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
