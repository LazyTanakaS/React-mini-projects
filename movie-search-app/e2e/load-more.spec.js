import { test, expect } from '@playwright/test'

const firstPage = {
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

const secondPage = {
  results: [
    {
      id: 3,
      title: 'GoodFellas',
      release_date: '1999-01-27',
      poster_path: null,
      vote_average: 8.5,
    },
    {
      id: 4,
      title: 'Fight Club',
      release_date: '2000-02-10',
      poster_path: null,
      vote_average: 8.4,
    },
  ],
  total_pages: 2,
}

test.beforeEach(async ({ page }) => {
  await page.route('https://api.themoviedb.org/**', route =>
    route.fulfill({ json: { results: [], total_pages: 1, genres: [] } })
  )

  await page.route(/api\.themoviedb\.org\/3\/search\/movie/, route => {
    const pageNumber = new URL(route.request().url()).searchParams.get('page')
    route.fulfill({ json: pageNumber === '1' ? firstPage : secondPage })
  })
})

test('Load More adds the next page of results', async ({ page }) => {
  await page.goto('')
  await page.getByPlaceholder('Search the movie...').fill('Matr')
  await expect(page.getByRole('heading', { name: 'Matrix' })).toBeVisible()
  await page.getByRole('button', { name: 'Load More Movies' }).click()
  await expect(page.locator('.results-counter')).toHaveText('Found 4 movies')
  await expect(
    page.getByRole('button', { name: 'Load More Movies' })
  ).toBeHidden()
})
