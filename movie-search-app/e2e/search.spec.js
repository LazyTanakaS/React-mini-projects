import { test, expect } from '@playwright/test'

const matrixMovies = {
  results: [
    {
      id: 1,
      title: 'Matrix',
      release_date: '1999-03-31',
      poster_path: null,
      vote_average: 8.2,
    },

    {
      id: 2,
      title: 'Batman',
      release_date: '2003-05-15',
      poster_path: null,
      vote_average: 7.1,
    },
  ],
  total_pages: 2,
}

test.beforeEach(async ({ page }) => {
  await page.route('https://api.themoviedb.org/**', route =>
    route.fulfill({ json: { results: [], total_pages: 1, genres: [] } })
  )

  await page.route(/api\.themoviedb\.org\/3\/search\/movie/, route =>
    route.fulfill({ json: matrixMovies })
  )
})

test('search shows movies from the API', async ({ page }) => {
  await page.goto('')
  await page.getByPlaceholder('Search the movie...').fill('Matr')
  await expect(page.getByRole('heading', { name: 'Matrix' })).toBeVisible()
  await expect(page.locator('.results-counter')).toHaveText('Found 2 movies')
})
