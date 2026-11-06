import { useQuery } from '@tanstack/react-query'

function useMovieDetails(detailUrl, parseResponse) {
  return useQuery({
    queryKey: ['movie-details', detailUrl],
    queryFn: async ({ signal }) => {
      const response = await fetch(detailUrl, { signal })

      if (!response.ok) {
        throw new Error('Failed to fetch')
      }

      const result = await response.json()
      const parsed = parseResponse(result)

      return parsed
    },
    enabled: Boolean(detailUrl),
  })
}

export default useMovieDetails
