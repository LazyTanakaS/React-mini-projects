import { useState, useEffect, useRef } from 'react'

function useMovieData(baseUrl, page = 1, parseResponse) {
  const [data, setData] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortControllerRef = useRef(null)
  const prevBaseUrlRef = useRef(null)

  useEffect(() => {
    if (!baseUrl) {
      prevBaseUrlRef.current = null

      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    const isNewQuery = baseUrl !== prevBaseUrlRef.current

    const url = `${baseUrl}&page=${page}`

    async function fetchData() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(url, { signal: controller.signal })

        if (!response.ok) {
          throw new Error('Failed to fetch')
        }

        const result = await response.json()
        const parsed = parseResponse(result)

        if (isNewQuery) {
          setData(parsed.items || [])
        } else {
          setData(prev => [...prev, ...(parsed.items || [])])
        }

        setTotalPages(parsed.totalPages || 1)
      } catch (err) {
        if (err.name === 'AbortError') {
          return
        }
        setError(err)
      } finally {
        setIsLoading(false)
        prevBaseUrlRef.current = baseUrl
      }
    }

    fetchData()

    return () => {
      controller.abort()
    }
  }, [baseUrl, page, parseResponse])

  return { data, totalPages, isLoading, error }
}

export default useMovieData
