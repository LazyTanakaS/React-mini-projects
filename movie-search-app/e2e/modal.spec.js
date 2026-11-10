import { test, expect } from '@playwright/test'

const searchResults = {
  results: [
    {
      id: 1,
      title: 'Matrix',
      release_date: '1999-03-31',
      poster_path: null,
      vote_average: 8.2,
    },
  ],
  total_pages: 1,
}

const movieDetails = {
  id: 1,
  title: 'Matrix',
  release_date: '1999-03-31',
  vote_average: 8.2,
  runtime: 136,
  genres: [{ id: 28, name: 'Action' }],
  overview:
    'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.',
}

test.beforeEach(async ({ page }) => {
  await page.route('https://api.themoviedb.org/**', route =>
    route.fulfill({ json: { results: [], total_pages: 1, genres: [] } })
  )
  await page.route(/api\.themoviedb\.org\/3\/search\/movie/, route =>
    route.fulfill({ json: searchResults })
  )
  await page.route(/api\.themoviedb\.org\/3\/movie\/1/, route =>
    route.fulfill({ json: movieDetails })
  )
})

test('clicking a card opens the modal with movie details', async ({ page }) => {
  await page.goto('')
  await page.getByPlaceholder('Search the movie...').fill('Matrix')
  await page.getByRole('heading', { name: 'Matrix' }).click()
  await expect(page.locator('.modal-content')).toBeVisible()
  await expect(page.locator('.modal-content')).toContainText('136 min')
})
