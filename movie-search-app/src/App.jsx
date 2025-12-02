import { useCallback, useEffect, useState } from 'react'
import './App.css'
import MovieCard from './components/MovieCard/MovieCard'
import SearchBar from './components/SearchBar/SearchBar'
import CategoryTabs from './components/CategoryTabs/CategoryTabs'
import MovieModal from './components/MovieModal/MovieModal'
import Filters from './components/Filtres/Filters'

function App() {
  // API configuration
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY
  const BASE_URL = 'https://api.themoviedb.org/3'
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

  // UI state (grouped)
  const [uiState, setUiState] = useState({
    isLoading: false,
    error: null,
    isTyping: false,
    showScrollButton: false,
  })

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [movies, setMovies] = useState([])

  // Category state
  const [category, setCategory] = useState('popular')
  const [categoryMovies, setCategoryMovies] = useState([])
  const [filtersApplied, setFiltersApplied] = useState(false)

  // Modal state (grouped)
  const [modal, setModal] = useState({
    isOpen: false,
    selectedMovie: null,
  })

  // Pagination state (grouped)
  const [pagination, setPagination] = useState({
    searchPage: 1,
    categoryPage: 1,
    searchTotalPages: 1,
    categoryTotalPages: 1,
  })

  // Filter state (grouped)
  const [filters, setFilters] = useState({
    genres: [],
    selectedGenres: [],
    yearFrom: '',
    yearTo: '',
    minRating: 0,
  })

  // Favorites (localStorage)
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

  // Search history (localStorage)
  const [searchHistory, setSearchHistory] = useState(() => {
    const search = localStorage.getItem('searchHistory')

    if (search) {
      try {
        return JSON.parse(search)
      } catch (err) {
        console.error('Failed to parse search', err)
        return []
      }
    }
    return []
  })

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
  }, [searchHistory])

  /**
   * Add search query to history (max 5 items)
   */
  const addToSearchHistory = query => {
    if (!query || query.trim() === '') return

    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== query)
      return [query, ...filtered].slice(0, 5)
    })
  }

  /**
   * Search movies by query with pagination
   */
  const searchMovie = useCallback(
    async (query, page = 1) => {
      if (query === '') {
        setUiState(prev => ({
          ...prev,
          error: 'Please enter the name of the movie',
        }))
        return
      }

      setUiState(prev => ({ ...prev, isLoading: true, error: null }))

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
          if (data.results && data.results.length > 0) {
            addToSearchHistory(query)
          }
        } else {
          setMovies(prev => [...prev, ...(data.results || [])])
        }

        setPagination(prev => ({
          ...prev,
          searchTotalPages: data.total_pages || 1,
        }))

        if (data.results.length === 0) {
          setUiState(prev => ({ ...prev, error: 'No movie found' }))
        }
      } catch (err) {
        setUiState(prev => ({ ...prev, error: err.message }))
        setMovies([])
      } finally {
        setUiState(prev => ({ ...prev, isLoading: false }))
      }
    },
    [API_KEY, BASE_URL]
  )

  // Debounced search effect (500ms delay)
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3) {
      setMovies([])
      setUiState(prev => ({ ...prev, error: null, isTyping: false }))
      return
    }

    setUiState(prev => ({ ...prev, isTyping: true }))
    setPagination(prev => ({ ...prev, searchPage: 1 }))

    const timerId = setTimeout(() => {
      searchMovie(searchQuery, 1)
      setUiState(prev => ({ ...prev, isTyping: false }))
    }, 500)

    return () => clearTimeout(timerId)
  }, [searchQuery, searchMovie])

  // Handle scroll button visibility
  useEffect(() => {
    const handleScroll = () => {
      setUiState(prev => ({
        ...prev,
        showScrollButton: window.scrollY > 300,
      }))
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /**
   * Scroll to top of the page smoothly
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // Determine which movies to display based on category
  const moviesToDisplay =
    searchQuery.length >= 3
      ? movies
      : category === 'favorites'
      ? favorites
      : categoryMovies

  /**
   * Fetch movies by category (popular, top_rated, now_playing)
   */
  const fetchCategoryMovies = useCallback(
    async (category, page = 1) => {
      setUiState(prev => ({ ...prev, isLoading: true, error: null }))

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

        setPagination(prev => ({
          ...prev,
          categoryTotalPages: data.total_pages || 1,
        }))

        if (data.results.length === 0) {
          setUiState(prev => ({
            ...prev,
            error: 'No movies found in this category',
          }))
        }
      } catch (err) {
        setUiState(prev => ({ ...prev, error: err.message }))
        setCategoryMovies([])
      } finally {
        setUiState(prev => ({ ...prev, isLoading: false }))
      }
    },
    [API_KEY, BASE_URL]
  )

  // Fetch category movies when category changes
  useEffect(() => {
    if (category === 'favorites') {
      setFilters(prev => ({ ...prev, selectedGenres: [] }))
      setFiltersApplied(false)
      return
    }

    setFilters(prev => ({ ...prev, selectedGenres: [] }))
    setFiltersApplied(false)
    setPagination(prev => ({ ...prev, categoryPage: 1 }))
    fetchCategoryMovies(category, 1)
  }, [category, fetchCategoryMovies])

  /**
   * Fetch detailed information about a specific movie
   */
  const fetchMovieDetails = async movieId => {
    try {
      const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to load details...')
      }

      const data = await response.json()
      setModal({ isOpen: true, selectedMovie: data })
    } catch (err) {
      console.error('Error fetching movie details:', err)
      setUiState(prev => ({ ...prev, error: err.message }))
    }
  }

  /**
   * Fetch available movie genres from TMDB API
   */
  const fetchGenres = useCallback(async () => {
    try {
      const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to load genres')
      }

      const data = await response.json()

      setFilters(prev => ({ ...prev, genres: data.genres }))
    } catch (err) {
      console.error('Failed to fetch genres:', err)
    }
  }, [API_KEY, BASE_URL])

  // Fetch genres on mount
  useEffect(() => {
    fetchGenres()
  }, [fetchGenres])

  /**
   * Discover movies with applied filters (genres, year, rating)
   */
  const discoverMovies = async (filterParams, page = 1) => {
    setUiState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}`

      if (filterParams.genres && filterParams.genres.length > 0) {
        url += `&with_genres=${filterParams.genres.join(',')}`
      }

      if (filterParams.yearFrom) {
        url += `&primary_release_date.gte=${filterParams.yearFrom}-01-01`
      }

      if (filterParams.yearTo) {
        url += `&primary_release_date.lte=${filterParams.yearTo}-12-31`
      }

      if (filterParams.minRating > 0) {
        url += `&vote_average.gte=${filterParams.minRating}`
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

      setPagination(prev => ({
        ...prev,
        categoryTotalPages: data.total_pages || 1,
      }))
      setFiltersApplied(true)
    } catch (err) {
      setUiState(prev => ({ ...prev, error: err.message }))
      setCategoryMovies([])
    } finally {
      setUiState(prev => ({ ...prev, isLoading: false }))
    }
  }

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  /**
   * Add movie to favorites list
   */
  const addToFavorites = movie => {
    if (!favorites.some(fav => fav.id === movie.id)) {
      setFavorites(prev => [...prev, movie])
    }
  }

  /**
   * Remove movie from favorites list
   */
  const removeFromFavorites = movieId => {
    setFavorites(prev => prev.filter(fav => fav.id !== movieId))
  }

  /**
   * Check if movie is in favorites
   */
  const isFavorite = movieId => {
    return favorites.some(fav => fav.id === movieId)
  }

  // Event handlers (callbacks for child components)

  // Event handlers (callbacks for child components)

  const handleSearchChange = value => {
    setSearchQuery(value)
  }

  const handleClearHistory = () => {
    setSearchHistory([])
  }

  const handleSelectHistory = query => {
    setSearchQuery(query)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  const handleCategoryChange = newCategory => {
    setCategory(newCategory)
  }

  const handleCloseModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }))
  }

  const handleGenresChange = newGenres => {
    setFilters(prev => ({ ...prev, selectedGenres: newGenres }))
  }

  const handleYearFromChange = value => {
    setFilters(prev => ({ ...prev, yearFrom: value }))
  }

  const handleYearToChange = value => {
    setFilters(prev => ({ ...prev, yearTo: value }))
  }

  const handleMinRatingChange = value => {
    setFilters(prev => ({ ...prev, minRating: value }))
  }

  const handleApplyFilters = () => {
    setPagination(prev => ({ ...prev, categoryPage: 1 }))
    discoverMovies(
      {
        genres: filters.selectedGenres,
        yearFrom: filters.yearFrom,
        yearTo: filters.yearTo,
        minRating: filters.minRating,
      },
      1
    )
  }

  const handleResetFilters = () => {
    setFilters(prev => ({
      ...prev,
      selectedGenres: [],
      yearFrom: '',
      yearTo: '',
      minRating: 0,
    }))
    setFiltersApplied(false)
    setPagination(prev => ({ ...prev, categoryPage: 1 }))
    fetchCategoryMovies(category, 1)
  }

  return (
    <div className="app">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchHistory={searchHistory}
        onClearHistory={handleClearHistory}
        onSelectHistory={handleSelectHistory}
        onClearSearch={handleClearSearch}
      />

      {searchQuery && searchQuery.length < 3 && (
        <p className="search-hint">Type at least 3 characters to search...</p>
      )}

      {uiState.isTyping && <p className="search-status">Searching...</p>}

      {!uiState.isLoading && !uiState.error && moviesToDisplay.length > 0 && (
        <div className="results-counter">
          <p>
            Found <span className="count">{moviesToDisplay.length}</span> movies
          </p>
        </div>
      )}

      <CategoryTabs
        activeCategory={category}
        onCategoryChange={handleCategoryChange}
        favoritesCount={favorites.length}
      />

      {searchQuery.length < 3 && category !== 'favorites' && (
        <Filters
          genres={filters.genres}
          selectedGenres={filters.selectedGenres}
          onGenresChange={handleGenresChange}
          yearFrom={filters.yearFrom}
          yearTo={filters.yearTo}
          onYearFromChange={handleYearFromChange}
          onYearToChange={handleYearToChange}
          minRating={filters.minRating}
          onMinRatingChange={handleMinRatingChange}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          filtersApplied={filtersApplied}
        />
      )}

      <main className="main">
        {uiState.isLoading && (
          <div className="loader">
            <p>Loading...</p>
          </div>
        )}

        {uiState.error && (
          <div className="fails">
            <p>{uiState.error}</p>
          </div>
        )}

        {!uiState.isLoading &&
          !uiState.error &&
          moviesToDisplay.length === 0 && (
            <div className="empty-state">
              <p>
                {category === 'favorites'
                  ? 'No favorites yet. Add movies by clicking the ❤️ button!'
                  : 'Search for your favorite movies'}
              </p>
            </div>
          )}

        {!uiState.isLoading && !uiState.error && moviesToDisplay.length > 0 && (
          <>
            <div className="movies-grid">
              {moviesToDisplay.map(movie => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onCardClick={() => fetchMovieDetails(movie.id)}
                  onFavoriteClick={
                    isFavorite(movie.id)
                      ? () => removeFromFavorites(movie.id)
                      : () => addToFavorites(movie)
                  }
                  isFavorite={isFavorite(movie.id)}
                />
              ))}
            </div>

            {category !== 'favorites' &&
              (searchQuery.length >= 3
                ? pagination.searchPage < pagination.searchTotalPages
                : pagination.categoryPage < pagination.categoryTotalPages) && (
                <div className="load-more-container">
                  <button
                    onClick={() => {
                      if (searchQuery.length >= 3) {
                        setPagination(prev => ({
                          ...prev,
                          searchPage: prev.searchPage + 1,
                        }))
                        searchMovie(searchQuery, pagination.searchPage + 1)
                      } else if (filtersApplied) {
                        setPagination(prev => ({
                          ...prev,
                          categoryPage: prev.categoryPage + 1,
                        }))
                        discoverMovies(
                          {
                            genres: filters.selectedGenres,
                            yearFrom: filters.yearFrom,
                            yearTo: filters.yearTo,
                            minRating: filters.minRating,
                          },
                          pagination.categoryPage + 1
                        )
                      } else {
                        setPagination(prev => ({
                          ...prev,
                          categoryPage: prev.categoryPage + 1,
                        }))
                        fetchCategoryMovies(
                          category,
                          pagination.categoryPage + 1
                        )
                      }
                    }}
                    className="load-more-button"
                    disabled={uiState.isLoading}
                  >
                    {uiState.isLoading ? 'Loading...' : 'Load More Movies'}
                  </button>
                </div>
              )}
          </>
        )}
      </main>

      {uiState.showScrollButton && (
        <button onClick={scrollToTop} className="scroll-to-top">
          ↑
        </button>
      )}

      <MovieModal
        isOpen={modal.isOpen}
        movie={modal.selectedMovie}
        onClose={handleCloseModal}
        imageBaseUrl={IMAGE_BASE_URL}
      />
    </div>
  )
}

export default App
