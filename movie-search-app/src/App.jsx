import { use, useEffect, useState } from 'react'
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

  const [category, setCategory] = useState('popular')
  const [categoryMovies, setCategoryMovies] = useState([])
  const [filtersApplied, setFiltersApplied] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)

  const [searchPage, setSearchPage] = useState(1)
  const [categoryPage, setCategoryPage] = useState(1)

  const [searchTotalPages, setSearchTotalPages] = useState(1)
  const [categoryTotalPages, setCategoryTotalPages] = useState(1)

  const [genres, setGenres] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [yearFrom, setYearFrom] = useState('')
  const [yearTo, setYearTo] = useState('')
  const [minRating, setMinRating] = useState(0)

  const searchMovie = async (query, page = 1) => {
    if (query === '') {
      setError('Please enter the name of the movie')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&page=${page}&query=${encodeURIComponent(
        query
      )}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Movie not found')
      }

      const data = await response.json()

      if (page === 1) {
        setMovies(data.results || [])
      } else {
        setMovies(prev => [...prev, ...(data.results || [])])
      }

      setSearchTotalPages(data.total_pages || 1)

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
    setCategoryPage(1)

    const timerId = setTimeout(() => {
      searchMovie(searchQuery, 1)
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

  const fetchCategoryMovies = async (category, page = 1) => {
    setIsLoading(true)
    setError(null)

    try {
      const url = `${BASE_URL}/movie/${category}?api_key=${API_KEY}&page=${page}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to load category movies')
      }

      const data = await response.json()

      if (page === 1) {
        setCategoryMovies(data.results || [])
      } else {
        setCategoryMovies(prev => [...prev, ...(data.results || [])])
      }

      setCategoryTotalPages(data.total_pages || 1)

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
    setSelectedGenres([])
    setFiltersApplied(false)

    setSearchPage(1)
    fetchCategoryMovies(category, 1)
  }, [category])

  const fetchMovieDetails = async movieId => {
    try {
      const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to load details...')
      }

      const data = await response.json()
      setSelectedMovie(data)
      setIsModalOpen(true)
    } catch (err) {
      console.error('Error fetching movie details:', err)
      setError(err.message)
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  useEffect(() => {
    const handleEscape = e => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isModalOpen])

  const fetchGenres = async () => {
    try {
      const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failde to load genres')
      }

      const data = await response.json()

      setGenres(data.genres)
    } catch (err) {
      console.error('Failder to fetch genres:', err)
    }
  }

  useEffect(() => {
    fetchGenres()
  }, [])

  const discoverMovies = async (filters, page = 1) => {
    setIsLoading(true)
    setError(null)

    try {
      let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}`

      if (filters.genres && filters.genres.length > 0) {
        url += `&with_genres=${filters.genres.join(',')}`
      }

      if (filters.yearFrom) {
        url += `&primary_release_date.gte=${filters.yearFrom}-01-01`
      }

      if (filters.yearTo) {
        url += `&primary_release_date.lte=${filters.yearTo}-12-31`
      }

      if (filters.minRating > 0) {
        url += `&vote_average.gte=${filters.minRating}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to load Filters')
      }

      const data = await response.json()

      if (page === 1) {
        setCategoryMovies(data.results || [])
      } else {
        setCategoryMovies(prev => [...prev, ...(data.results || [])])
      }

      setCategoryTotalPages(data.total_pages || 1)
      setFiltersApplied(true)
    } catch (err) {
      setError(err.message)
      setCategoryMovies([])
    } finally {
      setIsLoading(false)
    }
  }

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

      {searchQuery.length < 3 && (
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
                    onChange={() => {
                      setSelectedGenres(prev =>
                        prev.includes(genre.id)
                          ? prev.filter(id => id !== genre.id)
                          : [...prev, genre.id]
                      )
                    }}
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
                  onChange={e => setYearFrom(e.target.value)}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="year-input"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="To (e.g. 2024"
                  value={yearTo}
                  onChange={e => setYearTo(e.target.value)}
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
                step={'0.5'}
                value={minRating}
                onChange={e => setMinRating(parseFloat(e.target.value))}
                className="rating-slider"
              />
            </div>

            <div className="filter-action">
              <button
                className="apply-filter-button"
                onClick={() => {
                  setCategoryPage(1)
                  discoverMovies(
                    {
                      genres: selectedGenres,
                      yearFrom,
                      yearTo,
                      minRating,
                    },
                    1
                  )
                }}
                disabled={
                  selectedGenres.length === 0 &&
                  !yearFrom &&
                  !yearTo &&
                  minRating === 0
                }
              >
                Apply
              </button>

              <button
                className="reset-filter-button"
                onClick={() => {
                  setSelectedGenres([])
                  setYearFrom('')
                  setYearTo('')
                  setMinRating(0)
                  setFiltersApplied(false)
                  setCategoryPage(1)
                  fetchCategoryMovies(category, 1)
                }}
              >
                Reset
              </button>
            </div>

            {(filtersApplied && selectedGenres.length > 0) ||
              yearFrom ||
              yearTo ||
              (minRating > 0 && (
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
              ))}
          </div>
        </div>
      )}

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
          <>
            <div className="movies-grid">
              {moviesToDisplay.map(movie => (
                <div
                  className="movie-card"
                  key={movie.id}
                  onClick={() => fetchMovieDetails(movie.id)}
                >
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
                      {movie.vote_average
                        ? movie.vote_average.toFixed(1)
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {(searchQuery.length >= 3
              ? searchPage < searchTotalPages
              : categoryPage < categoryTotalPages) && (
              <div className="load-more-container">
                <button
                  onClick={() => {
                    if (searchQuery.length >= 3) {
                      setSearchPage(prev => prev + 1)
                      searchMovie(searchQuery, searchPage + 1)
                    } else if (filtersApplied) {
                      setCategoryPage(prev => prev + 1)
                      discoverMovies(
                        {
                          genres: selectedGenres,
                          yearFrom,
                          yearTo,
                          minRating,
                        },
                        categoryPage + 1
                      )
                    } else {
                      setCategoryPage(prev => prev + 1)
                      fetchCategoryMovies(category, categoryPage + 1)
                    }
                  }}
                  className="load-more-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Load More Movies'}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {showScrollButton && (
        <button onClick={scrollToTop} className="scroll-to-top">
          ↑
        </button>
      )}

      {/* Modal */}
      {isModalOpen && selectedMovie && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>

            <div className="modal-header">
              {selectedMovie.backdrop_path && (
                <img
                  src={`${IMAGE_BASE_URL}${selectedMovie.backdrop_path}`}
                  alt={selectedMovie.title}
                  className="modal-backdrop"
                />
              )}
              <h2 className="modal-title">{selectedMovie.title}</h2>
            </div>

            <div className="modal-body">
              <div className="modal-info">
                <p>
                  <strong>Release Date:</strong>{' '}
                  {selectedMovie.release_date || 'N/A'}
                </p>
                <p>
                  <strong>Rating</strong>⭐{' '}
                  {selectedMovie.vote_average
                    ? selectedMovie.vote_average.toFixed(1)
                    : 'N/A'}{' '}
                  / 10
                </p>
                <p>
                  <strong>Runtime</strong>{' '}
                  {selectedMovie.runtime
                    ? `${selectedMovie.runtime} min`
                    : 'N/A'}
                </p>
                {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                  <p>
                    <strong>Genres:</strong>{' '}
                    {selectedMovie.genres.map(g => g.name).join(', ')}
                  </p>
                )}
                {selectedMovie.revenue > 0 && (
                  <p>
                    <strong>Revenue</strong> $
                    {selectedMovie.revenue.toLocaleString()}
                  </p>
                )}
              </div>

              <div className="modal-overview">
                <h3>Overview</h3>
                <p>{selectedMovie.overview || 'No overview available'}</p>
              </div>

              {selectedMovie.tagline && (
                <div className="modal-tagline">
                  <em>"{selectedMovie.tagline}"</em>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
