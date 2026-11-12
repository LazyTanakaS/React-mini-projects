import { useQuery } from '@tanstack/react-query'

function useMovieDetails(movieId, detailUrl) {
  return useQuery({
    queryKey: ['movie-details', movieId],
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
