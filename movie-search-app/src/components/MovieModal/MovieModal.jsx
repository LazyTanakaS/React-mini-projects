import React, { useEffect } from 'react'
import './MovieModal.css'

function MovieModal({ isOpen, movie, onClose, imageBaseUrl }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = e => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen || !movie) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-header">
          {movie.backdrop_path && (
            <img
              src={`${imageBaseUrl}${movie.backdrop_path}`}
              alt={movie.title}
              className="modal-backdrop"
            />
          )}
          <h2 className="modal-title">{movie.title}</h2>
        </div>

        <div className="modal-body">
          <div className="modal-info">
            <p>
              <strong>Release Date:</strong> {movie.release_date || 'N/A'}
            </p>
            <p>
              <strong>Rating</strong>⭐{' '}
              {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} / 10
            </p>
            <p>
              <strong>Runtime</strong>{' '}
              {movie.runtime ? `${movie.runtime} min` : 'N/A'}
            </p>
            {movie.genres && movie.genres.length > 0 && (
              <p>
                <strong>Genres:</strong>{' '}
                {movie.genres.map(g => g.name).join(', ')}
              </p>
            )}
            {movie.revenue > 0 && (
              <p>
                <strong>Revenue</strong> ${movie.revenue.toLocaleString()}
              </p>
            )}
          </div>

          <div className="modal-overview">
            <h3>Overview</h3>
            <p>{movie.overview || 'No overview available'}</p>
          </div>

          {movie.tagline && (
            <div className="modal-tagline">
              <em>"{movie.tagline}"</em>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieModal
