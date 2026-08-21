import { useCallback, useEffect, useState } from 'react'
import './App.css'
import MovieCard from './components/MovieCard/MovieCard'
import SearchBar from './components/SearchBar/SearchBar'
import CategoryTabs from './components/CategoryTabs/CategoryTabs'
import MovieModal from './components/MovieModal/MovieModal'
import Filters from './components/Filters/Filters'
import useFavorites from './hooks/useFavorites'
import useDebounce from './hooks/useDebounce'
import useMovieData from './hooks/useMovieData'
import useSearchHistory from './hooks/useSearchHistory'

// API configuration
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

// Constants
const MIN_SEARCH_QUERY_LENGTH = 3
const SEARCH_DEBOUNCE_DELAY = 500 // ms
const SCROLL_BUTTON_THRESHOLD = 300 // px
const INITIAL_PAGE = 1
const DEFAULT_PAGE_COUNT = 1
const EMPTY_RESULTS = 0
const MIN_RATING_DEFAULT = 0

function buildDiscoverUrl(filters) {
  let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}`

  if (filters.selectedGenres.length > EMPTY_RESULTS) {
    url += `&with_genres=${filters.selectedGenres.join(',')}`
  }

  if (filters.yearFrom) {
    url += `&primary_release_date.gte=${filters.yearFrom}-01-01`
  }

  if (filters.yearTo) {
    url += `&primary_release_date.lte=${filters.yearTo}-12-31`
  }

  if (filters.minRating > MIN_RATING_DEFAULT) {
    url += `&vote_average.gte=${filters.minRating}`
  }

  return url
}

function App() {
  // UI state (grouped)
  const [uiState, setUiState] = useState({
    isLoading: false,
    error: null,
    isTyping: false,
    showScrollButton: false,
  })

  // Search state
  const [searchQuery, setSearchQuery] = useState('')

  // Category state
  const [category, setCategory] = useState('popular')
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

  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_DELAY)
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } =
    useFavorites()
  const { searchHistory, addToHistory, clearHistory } = useSearchHistory()

  const searchUrl = debouncedQuery
    ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        debouncedQuery
      )}`
    : null

  const categoryUrl =
    category === 'favorites'
      ? null
      : filtersApplied
        ? buildDiscoverUrl(filters)
        : `${BASE_URL}/movie/${category}?api_key=${API_KEY}`

  const {
    data: searchResults,
    totalPages: searchTotalPages,
    isLoading: isSearchLoading,
    error: searchError,
  } = useMovieData(searchUrl, pagination.searchPage)
  const {
    data: categoryResults,
    totalPages: categoryTotalPages,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useMovieData(categoryUrl, pagination.categoryPage)

  useEffect(() => {
    if (!searchQuery || searchQuery.length < MIN_SEARCH_QUERY_LENGTH) {
      setUiState(prev => ({ ...prev, error: null, isTyping: false }))
      return
    }

    setUiState(prev => ({ ...prev, isTyping: true }))
  }, [searchQuery])

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < MIN_SEARCH_QUERY_LENGTH) {
      return
    }

    setPagination(prev => ({ ...prev, searchPage: INITIAL_PAGE }))
    setUiState(prev => ({ ...prev, isTyping: false }))
  }, [debouncedQuery])

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
      ? searchResults
      : category === 'favorites'
        ? favorites
        : categoryResults

  const isLoading =
    searchQuery.length >= MIN_SEARCH_QUERY_LENGTH
      ? isSearchLoading
      : isCategoryLoading

  const error =
    searchQuery.length >= MIN_SEARCH_QUERY_LENGTH ? searchError : categoryError

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
  }, [category])

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

  // Event handlers (callbacks for child components)

  const handleSearchChange = useCallback(value => {
    setSearchQuery(value)
  }, [])

  const handleSearchSubmit = useCallback(() => {
    addToHistory(searchQuery)
  }, [addToHistory, searchQuery])

  const handleClearHistory = useCallback(() => {
    clearHistory()
  }, [clearHistory])

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
    setFiltersApplied(true)
  }, [])

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
  }, [])

  // Load more handlers
  const handleLoadMoreSearch = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      searchPage: prev.searchPage + 1,
    }))
  }, [])

  const handleLoadMoreCategory = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      categoryPage: prev.categoryPage + 1,
    }))
  }, [])

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
        onSearchSubmit={handleSearchSubmit}
      />

      {searchQuery && searchQuery.length < MIN_SEARCH_QUERY_LENGTH && (
        <p className="search-hint">
          Type at least {MIN_SEARCH_QUERY_LENGTH} characters to search...
        </p>
      )}

      {uiState.isTyping && <p className="search-status">Searching...</p>}

      {!isLoading && !error && moviesToDisplay.length > EMPTY_RESULTS && (
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
        {isLoading && (
          <div className="loader">
            <p>Loading...</p>
          </div>
        )}

        {error && (
          <div className="fails">
            <p>{error.message}</p>
          </div>
        )}

        {!isLoading && !error && moviesToDisplay.length === EMPTY_RESULTS && (
          <div className="empty-state">
            <p>
              {category === 'favorites'
                ? 'No favorites yet. Add movies by clicking the ❤️ button!'
                : 'Search for your favorite movies'}
            </p>
          </div>
        )}

        {!isLoading && !error && moviesToDisplay.length > EMPTY_RESULTS && (
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
                ? pagination.searchPage < searchTotalPages
                : pagination.categoryPage < categoryTotalPages) && (
                <div className="load-more-container">
                  <button
                    onClick={() => {
                      if (searchQuery.length >= MIN_SEARCH_QUERY_LENGTH) {
                        handleLoadMoreSearch()
                      } else {
                        handleLoadMoreCategory()
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
