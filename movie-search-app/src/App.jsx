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

  // Constants
  const SEARCH_HISTORY_MAX_SIZE = 5
  const MIN_SEARCH_QUERY_LENGTH = 3
  const SEARCH_DEBOUNCE_DELAY = 500 // ms
  const SCROLL_BUTTON_THRESHOLD = 300 // px
  const INITIAL_PAGE = 1
  const DEFAULT_PAGE_COUNT = 1
  const EMPTY_RESULTS = 0
  const MIN_RATING_DEFAULT = 0

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
    searchPage: INITIAL_PAGE,
    categoryPage: INITIAL_PAGE,
    searchTotalPages: DEFAULT_PAGE_COUNT,
    categoryTotalPages: DEFAULT_PAGE_COUNT,
  })

  // Filter state (grouped)
  const [filters, setFilters] = useState({
    genres: [],
    selectedGenres: [],
    yearFrom: '',
    yearTo: '',
    minRating: MIN_RATING_DEFAULT,
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
   * Add search query to history (max items defined by SEARCH_HISTORY_MAX_SIZE)
   */
  const addToSearchHistory = query => {
    if (!query || query.trim() === '') return

    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== query)
      return [query, ...filtered].slice(0, SEARCH_HISTORY_MAX_SIZE)
    })
  }

  /**
   * Universal function for fetching movies from TMDB API
   * Handles loading states, errors, and pagination
   */
  const fetchMovies = useCallback(
    async ({
      url,
      page = INITIAL_PAGE,
      onError = 'Failed to load movies',
      updateState,
      additionalAction,
    }) => {
      setUiState(prev => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(onError)
        }

        const data = await response.json()

        // Update state with results
        updateState(data, page)

        // Execute additional action if provided (e.g., add to history)
        if (additionalAction && data.results?.length > EMPTY_RESULTS) {
          additionalAction(data)
        }

        // Show error if no results
        if (data.results?.length === EMPTY_RESULTS) {
          setUiState(prev => ({ ...prev, error: 'No movies found' }))
        }

        return data
      } catch (err) {
        setUiState(prev => ({ ...prev, error: err.message }))
        // Clear results on error
        updateState({ results: [] }, page)
        throw err
      } finally {
        setUiState(prev => ({ ...prev, isLoading: false }))
      }
    },
    []
  )

  /**
   * Search movies by query with pagination
   */
  const searchMovie = useCallback(
    async (query, page = INITIAL_PAGE) => {
      if (query === '') {
        setUiState(prev => ({
          ...prev,
          error: 'Please enter the name of the movie',
        }))
        return
      }

      const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&page=${page}&query=${encodeURIComponent(
        query
      )}`

      await fetchMovies({
        url,
        page,
        onError: 'Movie not found',
        updateState: (data, currentPage) => {
          if (currentPage === INITIAL_PAGE) {
            setMovies(data.results || [])
          } else {
            setMovies(prev => [...prev, ...(data.results || [])])
          }
          setPagination(prev => ({
            ...prev,
            searchTotalPages: data.total_pages || DEFAULT_PAGE_COUNT,
          }))
        },
        additionalAction: () => addToSearchHistory(query),
      })
    },
    [API_KEY, BASE_URL, fetchMovies]
  )

  // Debounced search effect (delay defined by SEARCH_DEBOUNCE_DELAY)
  useEffect(() => {
    if (!searchQuery || searchQuery.length < MIN_SEARCH_QUERY_LENGTH) {
      setMovies([])
      setUiState(prev => ({ ...prev, error: null, isTyping: false }))
      return
    }

    setUiState(prev => ({ ...prev, isTyping: true }))
    setPagination(prev => ({ ...prev, searchPage: INITIAL_PAGE }))

    const timerId = setTimeout(() => {
      searchMovie(searchQuery, INITIAL_PAGE)
      setUiState(prev => ({ ...prev, isTyping: false }))
    }, SEARCH_DEBOUNCE_DELAY)

    return () => clearTimeout(timerId)
  }, [searchQuery, searchMovie])

  // Handle scroll button visibility
  useEffect(() => {
    const handleScroll = () => {
      setUiState(prev => ({
        ...prev,
        showScrollButton: window.scrollY > SCROLL_BUTTON_THRESHOLD,
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
      top: EMPTY_RESULTS,
      behavior: 'smooth',
    })
  }

  // Determine which movies to display based on category
  const moviesToDisplay =
    searchQuery.length >= MIN_SEARCH_QUERY_LENGTH
      ? movies
      : category === 'favorites'
      ? favorites
      : categoryMovies

  /**
   * Fetch movies by category (popular, top_rated, now_playing)
   */
  const fetchCategoryMovies = useCallback(
    async (category, page = INITIAL_PAGE) => {
      const url = `${BASE_URL}/movie/${category}?api_key=${API_KEY}&page=${page}`

      await fetchMovies({
        url,
        page,
        onError: 'Failed to load category movies',
        updateState: (data, currentPage) => {
          if (currentPage === INITIAL_PAGE) {
            setCategoryMovies(data.results || [])
          } else {
            setCategoryMovies(prev => [...prev, ...(data.results || [])])
          }
          setPagination(prev => ({
            ...prev,
            categoryTotalPages: data.total_pages || DEFAULT_PAGE_COUNT,
          }))
        },
      })
    },
    [API_KEY, BASE_URL, fetchMovies]
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
    setPagination(prev => ({ ...prev, categoryPage: INITIAL_PAGE }))
    fetchCategoryMovies(category, INITIAL_PAGE)
  }, [category, fetchCategoryMovies])

  /**
   * Fetch detailed information about a specific movie
   */
  const fetchMovieDetails = useCallback(
    async movieId => {
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
    },
    [API_KEY, BASE_URL]
  )

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
  const discoverMovies = useCallback(
    async (filterParams, page = INITIAL_PAGE) => {
      let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}`

      if (filterParams.genres && filterParams.genres.length > EMPTY_RESULTS) {
        url += `&with_genres=${filterParams.genres.join(',')}`
      }

      if (filterParams.yearFrom) {
        url += `&primary_release_date.gte=${filterParams.yearFrom}-01-01`
      }

      if (filterParams.yearTo) {
        url += `&primary_release_date.lte=${filterParams.yearTo}-12-31`
      }

      if (filterParams.minRating > MIN_RATING_DEFAULT) {
        url += `&vote_average.gte=${filterParams.minRating}`
      }

      await fetchMovies({
        url,
        page,
        onError: 'Failed to load filtered movies',
        updateState: (data, currentPage) => {
          if (currentPage === INITIAL_PAGE) {
            setCategoryMovies(data.results || [])
          } else {
            setCategoryMovies(prev => [...prev, ...(data.results || [])])
          }
          setPagination(prev => ({
            ...prev,
            categoryTotalPages: data.total_pages || DEFAULT_PAGE_COUNT,
          }))
        },
      })

      setFiltersApplied(true)
    },
    [API_KEY, BASE_URL, fetchMovies]
  )

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  /**
   * Add movie to favorites list
   */
  const addToFavorites = useCallback(
    movie => {
      if (!favorites.some(fav => fav.id === movie.id)) {
        setFavorites(prev => [...prev, movie])
      }
    },
    [favorites]
  )

  /**
   * Remove movie from favorites list
   */
  const removeFromFavorites = useCallback(movieId => {
    setFavorites(prev => prev.filter(fav => fav.id !== movieId))
  }, [])

  /**
   * Check if movie is in favorites
   */
  const isFavorite = useCallback(
    movieId => {
      return favorites.some(fav => fav.id === movieId)
    },
    [favorites]
  )

  // Event handlers (callbacks for child components)

  // Event handlers (callbacks for child components)

  const handleSearchChange = useCallback(value => {
    setSearchQuery(value)
  }, [])

  const handleClearHistory = useCallback(() => {
    setSearchHistory([])
  }, [])

  const handleSelectHistory = useCallback(query => {
    setSearchQuery(query)
  }, [])

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  const handleCategoryChange = useCallback(newCategory => {
    setCategory(newCategory)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModal(prev => ({ ...prev, isOpen: false }))
  }, [])

  const handleGenresChange = useCallback(newGenres => {
    setFilters(prev => ({ ...prev, selectedGenres: newGenres }))
  }, [])

  const handleYearFromChange = useCallback(value => {
    setFilters(prev => ({ ...prev, yearFrom: value }))
  }, [])

  const handleYearToChange = useCallback(value => {
    setFilters(prev => ({ ...prev, yearTo: value }))
  }, [])

  const handleMinRatingChange = useCallback(value => {
    setFilters(prev => ({ ...prev, minRating: value }))
  }, [])

  const handleApplyFilters = useCallback(() => {
    setPagination(prev => ({ ...prev, categoryPage: INITIAL_PAGE }))
    discoverMovies(
      {
        genres: filters.selectedGenres,
        yearFrom: filters.yearFrom,
        yearTo: filters.yearTo,
        minRating: filters.minRating,
      },
      INITIAL_PAGE
    )
  }, [filters, discoverMovies])

  const handleResetFilters = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      selectedGenres: [],
      yearFrom: '',
      yearTo: '',
      minRating: MIN_RATING_DEFAULT,
    }))
    setFiltersApplied(false)
    setPagination(prev => ({ ...prev, categoryPage: INITIAL_PAGE }))
    fetchCategoryMovies(category, INITIAL_PAGE)
  }, [category, fetchCategoryMovies])

  // Load more handlers
  const handleLoadMoreSearch = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      searchPage: prev.searchPage + 1,
    }))
    searchMovie(searchQuery, pagination.searchPage + 1)
  }, [searchQuery, pagination.searchPage, searchMovie])

  const handleLoadMoreFiltered = useCallback(() => {
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
  }, [filters, pagination.categoryPage, discoverMovies])

  const handleLoadMoreCategory = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      categoryPage: prev.categoryPage + 1,
    }))
    fetchCategoryMovies(category, pagination.categoryPage + 1)
  }, [category, pagination.categoryPage, fetchCategoryMovies])

  // Movie card handlers
  const handleMovieCardClick = useCallback(
    movieId => {
      fetchMovieDetails(movieId)
    },
    [fetchMovieDetails]
  )

  const handleToggleFavorite = useCallback(
    (movie, isCurrentlyFavorite) => {
      if (isCurrentlyFavorite) {
        removeFromFavorites(movie.id)
      } else {
        addToFavorites(movie)
      }
    },
    [addToFavorites, removeFromFavorites]
  )

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

      {searchQuery && searchQuery.length < MIN_SEARCH_QUERY_LENGTH && (
        <p className="search-hint">
          Type at least {MIN_SEARCH_QUERY_LENGTH} characters to search...
        </p>
      )}

      {uiState.isTyping && <p className="search-status">Searching...</p>}

      {!uiState.isLoading &&
        !uiState.error &&
        moviesToDisplay.length > EMPTY_RESULTS && (
          <div className="results-counter">
            <p>
              Found <span className="count">{moviesToDisplay.length}</span>{' '}
              movies
            </p>
          </div>
        )}

      <CategoryTabs
        activeCategory={category}
        onCategoryChange={handleCategoryChange}
        favoritesCount={favorites.length}
      />

      {searchQuery.length < MIN_SEARCH_QUERY_LENGTH &&
        category !== 'favorites' && (
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
          moviesToDisplay.length === EMPTY_RESULTS && (
            <div className="empty-state">
              <p>
                {category === 'favorites'
                  ? 'No favorites yet. Add movies by clicking the ❤️ button!'
                  : 'Search for your favorite movies'}
              </p>
            </div>
          )}

        {!uiState.isLoading &&
          !uiState.error &&
          moviesToDisplay.length > EMPTY_RESULTS && (
            <>
              <div className="movies-grid">
                {moviesToDisplay.map(movie => {
                  const isMovieFavorite = isFavorite(movie.id)
                  return (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onCardClick={() => handleMovieCardClick(movie.id)}
                      onFavoriteClick={() =>
                        handleToggleFavorite(movie, isMovieFavorite)
                      }
                      isFavorite={isMovieFavorite}
                    />
                  )
                })}
              </div>

              {category !== 'favorites' &&
                (searchQuery.length >= MIN_SEARCH_QUERY_LENGTH
                  ? pagination.searchPage < pagination.searchTotalPages
                  : pagination.categoryPage <
                    pagination.categoryTotalPages) && (
                  <div className="load-more-container">
                    <button
                      onClick={() => {
                        if (searchQuery.length >= MIN_SEARCH_QUERY_LENGTH) {
                          handleLoadMoreSearch()
                        } else if (filtersApplied) {
                          handleLoadMoreFiltered()
                        } else {
                          handleLoadMoreCategory()
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
