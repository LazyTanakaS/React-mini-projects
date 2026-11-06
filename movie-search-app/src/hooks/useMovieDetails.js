import { useQuery } from '@tanstack/react-query'

function useMovieDetails(detailUrl) {
  return useQuery({
    queryKey: ['movie-details', detailUrl],
    staleTime: 1000 * 60 * 1,
    queryFn: async ({ signal }) => {
      const response = await fetch(detailUrl, { signal })

      if (!response.ok) {
        throw new Error('Failed to fetch')
      }

      const result = await response.json()
      return result
    },
    enabled: Boolean(detailUrl),
  })
}

export default useMovieDetails
