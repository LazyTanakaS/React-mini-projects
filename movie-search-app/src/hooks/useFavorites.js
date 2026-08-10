import { useState, useEffect, useMemo, useCallback } from 'react'

function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (err) {
        console.error('Failed to parse favorites', err)
        return []
      }
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  const favoriteIds = useMemo(() => {
    return new Set(favorites.map(fav => fav.id))
  }, [favorites])

  const addToFavorites = useCallback(
    movie => {
      setFavorites(prev => {
        if (favoriteIds.has(movie.id)) {
          return prev
        }
        return [...prev, movie]
      })
    },
    [favoriteIds]
  )

  const removeFromFavorites = useCallback(movieId => {
    setFavorites(prev => prev.filter(fav => fav.id !== movieId))
  }, [])

  const isFavorite = useCallback(
    movieId => {
      return favoriteIds.has(movieId)
    },
    [favoriteIds]
  )

  return { favorites, addToFavorites, removeFromFavorites, isFavorite }
}

export default useFavorites
