import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useMovieDetails from './useMovieDetails'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  })

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useMovieDetails', () => {
  it('returns movie data when the request succeeds', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 1, title: 'Matrix' }),
      })
    )

    const { result } = renderHook(
      () =>
        useMovieDetails(1, 'https://api.themoviedb.org/3/movie/1?api_key=test'),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual({ id: 1, title: 'Matrix' })
  })

  it('returns an error when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    const { result } = renderHook(
      () => useMovieDetails(1, 'https://api.themoviedb.org'),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error.message).toBe('Failed to fetch')
  })

  it('does not fetch when detailUrl is null', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useMovieDetails(null), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('uses a separate cache entry for each movie id', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, title: 'Matrix' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 2, title: 'Inception' }),
      })
    vi.stubGlobal('fetch', fetchMock)

    const { result, rerender } = renderHook(
      ({ id, url }) => useMovieDetails(id, url),
      {
        wrapper: createWrapper(),
        initialProps: { id: 1, url: 'http://api.themoviedb.org/3/movie/1' },
      }
    )

    await waitFor(() => expect(result.current.data?.title).toBe('Matrix'))
    rerender({ id: 2, url: 'http://api.themoviedb.org/3/movie/2' })

    await waitFor(() => expect(result.current.data?.title).toBe('Inception'))
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
