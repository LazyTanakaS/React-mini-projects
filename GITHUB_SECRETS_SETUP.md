# GitHub Secrets Setup

To deploy apps that require API keys, you need to add them as GitHub secrets:

## Steps

1. Go to your repository on GitHub
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

### Movie Search App

- **Name**: `VITE_TMDB_API_KEY`
- **Value**: Your TMDB API key from <https://www.themoviedb.org/settings/api>

### Weather App

- **Name**: `VITE_OPENWEATHER_API_KEY`
- **Value**: Your OpenWeather API key from <https://openweathermap.org/api>

## Getting API Keys

### TMDB API Key

1. Go to <https://www.themoviedb.org/>
2. Create an account or log in
3. Go to Settings → API
4. Request an API key (choose "Developer" option)
5. Copy your API key and add it to GitHub secrets

### OpenWeather API Key

1. Go to <https://openweathermap.org/>
2. Create an account or log in
3. Go to API keys section
4. Copy your default API key or create a new one
5. Add it to GitHub secrets

After adding the secrets, the GitHub Actions workflow will automatically build and deploy the apps.
