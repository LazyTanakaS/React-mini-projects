import { useState, useEffect } from 'react'

const STORAGE_KEY = 'MovieSearchHistory'
const MAX_HISTORY_SIZE = 5

function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState(() => {
    const search = localStorage.getItem(STORAGE_KEY)

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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory))
  }, [searchHistory])

  const addToHistory = query => {
    if (!query || query.trim() === '') return

    setSearchHistory(prevHistory => {
      const filtered = prevHistory.filter(item => item !== query)
      return [query, ...filtered].slice(0, MAX_HISTORY_SIZE)
    })
  }

  const clearHistory = () => {
    setSearchHistory([])
  }

  return { searchHistory, addToHistory, clearHistory }
}

export default useSearchHistory
