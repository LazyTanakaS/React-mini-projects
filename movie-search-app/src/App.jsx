import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY
  const BASE_URL = 'https://api.themoviedb.org/3'
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

  const [searchQuery, setSearchQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)

  // STATE CATEGORIES
  const [category, setCategory] = useState('popular')
  const [categoryMovies, setCategoryMovies] = useState([])

  //   SEARCH MOVIE
  const searchMovie = async query => {
    if (query === '') {
      setError('Please enter the name of the movie')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Movie not found')
      }

      const data = await response.json()

      setMovies(data.results || [])

      if (data.results.length === 0) {
        setError('No movie found')
      }
    } catch (err) {
      setError(err.message)
      setMovies([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3) {
      setMovies([])
      setError(null)
      setIsTyping(false)
      return
    }

    setIsTyping(true)

    const timerId = setTimeout(() => {
      searchMovie(searchQuery)
      setIsTyping(false)
    }, 500)

    return () => clearTimeout(timerId)
  }, [searchQuery])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true)
      } else {
        setShowScrollButton(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const moviesToDisplay = searchQuery.length >= 3 ? movies : categoryMovies

  // CATEGORY SEARCH
  const fetchCategoryMovies = async category => {
    setIsLoading(true)
    setError(null)

    try {
      const url = `${BASE_URL}/movie/${category}?api_key=${API_KEY}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to load category movies')
      }

      const data = await response.json()
      setCategoryMovies(data.results || [])

      if (data.results.length === 0) {
        setError('No movies found in this category')
      }
    } catch (err) {
      setError(err.message)
      setCategoryMovies([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoryMovies(category)
  }, [category])

  return (
    <div className="app">
      <header className="header">
        <h1>Movie Search</h1>
        <form onSubmit={e => e.preventDefault()} className="search-form">
          <input
            type="text"
            placeholder="Search the movie..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="clear-button"
          >
            ✕
          </button>
        </form>
      </header>

      {searchQuery && searchQuery.length < 3 && (
        <p className="search-hint">Type at least 3 characters to search...</p>
      )}

      {isTyping && <p className="search-status">Searching...</p>}

      {!isLoading && !error && moviesToDisplay.length > 0 && (
        <div className="results-counter">
          <p>
            Found <span className="count">{moviesToDisplay.length}</span> movies
          </p>
        </div>
      )}

      <div className="category-tabs">
        <button
          type="button"
          className={category === 'popular' ? 'tab active' : 'tab'}
          onClick={() => setCategory('popular')}
        >
          Popular
        </button>

        <button
          type="button"
          className={category === 'top_rated' ? 'tab active' : 'tab'}
          onClick={() => setCategory('top_rated')}
        >
          Top Rated
        </button>

        <button
          type="button"
          className={category === 'now_playing' ? 'tab active' : 'tab'}
          onClick={() => setCategory('now_playing')}
        >
          Now playing
        </button>
      </div>

      <main className="main">
        {isLoading && (
          <div className="loader">
            <p>Loading...</p>
          </div>
        )}

        {error && (
          <div className="fails">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && moviesToDisplay.length === 0 && (
          <div className="empty-state">
            <p>Search for your favorite movies</p>
          </div>
        )}

        {!isLoading && !error && moviesToDisplay.length > 0 && (
          <div className="movies-grid">
            {moviesToDisplay.map(movie => (
              <div className="movie-card" key={movie.id}>
                <img
                  src={
                    movie.poster_path
                      ? `${IMAGE_BASE_URL}${movie.poster_path}`
                      : 'https://via.placeholder.com/500x750?text=No+Image'
                  }
                  alt={movie.title}
                  className="movie-poster"
                />

                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-release">
                    {movie.release_date
                      ? movie.release_date.split('-')[0]
                      : 'N/A'}
                  </p>
                  <p className="movie-rating">
                    ⭐{' '}
                    {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showScrollButton && (
        <button onClick={scrollToTop} className="scroll-to-top">
          ↑
        </button>
      )}
    </div>
  )
}

export default App
