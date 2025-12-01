# GitHub Secrets Setup

To deploy the Movie Search App, you need to add the TMDB API key as a GitHub secret:

## Steps

1. Go to your repository on GitHub
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secret:
   - **Name**: `VITE_TMDB_API_KEY`
   - **Value**: Your TMDB API key from <https://www.themoviedb.org/settings/api>

## Getting TMDB API Key

1. Go to <https://www.themoviedb.org/>
2. Create an account or log in
3. Go to Settings → API
4. Request an API key (choose "Developer" option)
5. Copy your API key and add it to GitHub secrets

After adding the secret, the GitHub Actions workflow will automatically build and deploy the Movie Search App.
