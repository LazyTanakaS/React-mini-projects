# 🎬 React Mini Projects

A collection of React applications demonstrating modern frontend development practices.

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript)
![CSS3](https://img.shields.io/badge/CSS3-Styled-1572B6?style=flat&logo=css3)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=flat&logo=vite)

## 🚀 Live Demos

| Project         | Demo                                                                             | Description                               |
| --------------- | -------------------------------------------------------------------------------- | ----------------------------------------- |
| 🎬 Movie Search | [Live Demo](https://lazytanakas.github.io/React-mini-projects/movie-search-app/) | Full-featured movie database with filters |
| 🌤️ Weather App  | [Live Demo](https://lazytanakas.github.io/React-mini-projects/weather-app/)      | Real-time weather with search history     |
| ✅ Todo List    | [Live Demo](https://lazytanakas.github.io/React-mini-projects/todo-list-app/)    | Task manager with priorities              |
| 🧮 Calculator   | [Live Demo](https://lazytanakas.github.io/React-mini-projects/calculator-app/)   | Functional calculator                     |
| 🔢 Counter      | [Live Demo](https://lazytanakas.github.io/React-mini-projects/counter-app/)      | Counter with history                      |

---

## 🎬 Movie Search App

**The most complex project** — a Netflix-style movie search application.

### Features

- 🔍 **Debounced search** (500ms delay to reduce API calls)
- 📂 **Category browsing** — Popular, Top Rated, Now Playing
- 🎛️ **Advanced filters** — by genre, year range, minimum rating
- ❤️ **Favorites** — save movies to localStorage
- 📜 **Search history** — quick access to recent searches
- 📄 **Pagination** — "Load More" for infinite scroll
- 🎭 **Movie details modal** — full info with backdrop image
- ⌨️ **Keyboard support** — ESC to close modal

### Architecture

```
src/
├── components/
│   ├── MovieCard/       # Individual movie card
│   ├── SearchBar/       # Search input with history dropdown
│   ├── CategoryTabs/    # Navigation tabs
│   ├── MovieModal/      # Details popup
│   └── Filters/         # Genre, year, rating filters
├── App.jsx              # Main container with state management
└── App.css              # Netflix-inspired styling
```

### Technical Highlights

- **Component-based architecture** — separated concerns, reusable components
- **Grouped state management** — related states combined into objects
- **Universal fetch function** — reduces code duplication
- **Constants for configuration** — no magic numbers
- **useCallback optimization** — prevents unnecessary re-renders
- **Accessibility** — aria-labels, keyboard navigation

### Tech Stack

`React 18` `Hooks (useState, useEffect, useCallback)` `TMDb API` `localStorage` `CSS Variables`

---

## 🌤️ Weather App

Real-time weather data with beautiful UI and theme switching.

### Features

- 🌡️ Temperature, wind, humidity, visibility
- 🔍 City search with validation
- 📜 Search history (last 7 cities)
- 🌓 Light/Dark theme toggle
- 💾 Data persistence in localStorage

### Technical Highlights

- Lazy state initialization from localStorage
- Multiple useEffect hooks for different concerns
- Environment variables for API key security
- Comprehensive error handling

---

## ✅ Todo List

Full-featured task manager with priorities and filtering.

### Features

- ✏️ Add, edit, delete tasks
- ✔️ Mark as completed
- 🎯 Priority levels (Low, Medium, High)
- 🔍 Filter: All / Active / Completed
- 📊 Sort by priority
- 💾 Persistent storage

---

## 🧮 Calculator

Functional calculator with European number format.

### Features

- ➕ Basic operations (+, −, ×, ÷)
- 📊 Percentage calculations
- 🔢 Decimal support (comma separator)
- ⬅️ Backspace functionality
- ⚠️ Division by zero handling

---

## 🛠️ Setup & Installation

```bash
# Clone the repository
git clone https://github.com/LazyTanakaS/React-mini-projects.git

# Navigate to a project
cd React-mini-projects/movie-search-app

# Install dependencies
npm install

# Create .env file (for projects with APIs)
echo "VITE_TMDB_API_KEY=your_api_key" > .env
echo "VITE_OPENWEATHER_API_KEY=your_api_key" > .env

# Run development server
npm run dev
```

### API Keys Required

- **Movie Search App**: [TMDb API](https://www.themoviedb.org/documentation/api) (free)
- **Weather App**: [OpenWeatherMap](https://openweathermap.org/api) (free)

---

## 📚 Concepts Demonstrated

| Concept               | Projects              |
| --------------------- | --------------------- |
| useState, useEffect   | All                   |
| useCallback           | Movie Search          |
| Component composition | Movie Search          |
| Props & callbacks     | Movie Search          |
| localStorage          | All except Calculator |
| API integration       | Movie Search, Weather |
| Debouncing            | Movie Search          |
| Error handling        | All                   |
| Conditional rendering | All                   |
| Responsive design     | All                   |

---

## 👤 Author

**Petro Komar**  
Junior Frontend Developer

- GitHub: [@LazyTanakaS](https://github.com/LazyTanakaS)
- Email: <petrokomar16@gmail.com>
