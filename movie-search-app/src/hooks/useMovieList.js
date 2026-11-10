import { useInfiniteQuery } from '@tanstack/react-query'

function useMovieList(baseUrl, parseResponse) {
  return useInfiniteQuery({
    queryKey: ['movie-list', baseUrl],
    queryFn: async ({ pageParam, signal }) => {
      const response = await fetch(`${baseUrl}&page=${pageParam}`, { signal })

      if (!response.ok) {
        throw new Error('Failed to fetch')
      }

      const result = await response.json()
      const parsed = parseResponse(result)

      return parsed
    },

    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1

      if (nextPage <= lastPage.totalPages) {
        return nextPage
      }

      return undefined
    },
    enabled: !!baseUrl,
  })
}

export default useMovieList
