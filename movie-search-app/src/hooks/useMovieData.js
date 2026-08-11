import { useState, useEffect, useRef } from 'react'

function useMovieData(url) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortControllerRef = useRef(null)

  useEffect(() => {
    if (!url) return

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    async function fetchData() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(url, { signal: controller.signal })

        if (!response.ok) {
          throw new Error('Failed to fetch')
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        if (err.name === 'AbortError') {
          return
        }
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    return () => {
      controller.abort()
    }
  }, [url])

  return { data, isLoading, error }
}

export default useMovieData
