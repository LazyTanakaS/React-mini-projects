# Weather App

A React-based weather application that fetches real-time weather data from OpenWeatherMap API.

## Features

- City search with real-time weather data
- Detailed information: temperature, wind speed, humidity, visibility
- Search history
- Light/Dark theme toggle
- Data persistence with localStorage
- Responsive design
- Loading and error states

## Technologies Used

- React 18
- OpenWeatherMap API
- React Icons
- CSS3 with custom properties
- Vite

## React Concepts Practiced

### Hooks

- **useState** - Multiple state variables (input, weather, history, theme, loading, error)
- **useEffect** - API calls and localStorage sync
- **Lazy initialization** - Loading data from localStorage on mount

### Core Concepts

- **Async/await** - API requests
- **Conditional rendering** - Loading/error/data states
- **Event handling** - Form submission, clicks
- **Array methods** - map(), filter() for lists
- **Controlled components** - Form inputs

## Key Features Implementation

**State Management:**

- Single weather object for related data
- Lazy initialization from localStorage

**History Management:**

- Filters duplicates before adding
- Keeps most recent cities
- Updates on re-search

**Theme System:**

- CSS variables for easy switching
- Persisted in localStorage

## What I Learned

**Challenges:**

1. Managing multiple related data → Used single object state
2. Preventing duplicate cities → filter() before adding
3. Understanding async/await → try/catch/finally pattern
4. localStorage persistence → useEffect with dependencies

**Key Takeaways:**

- useEffect for side effects (API, localStorage)
- Group related state data together
- User feedback (loading/error) improves UX
- CSS variables simplify theming
- Lazy initialization prevents unnecessary reads

## Installation

```bash
npm install
npm install react-icons
npm run dev
```

## Environment Variables

Create `.env` file in the root of weather-app:

```
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

Get your free API key from [OpenWeatherMap](https://openweathermap.org/api).

See `.env.example` for reference.
