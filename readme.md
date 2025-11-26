# React Mini Projects

A collection of practice projects built while learning React fundamentals.

## Purpose

These projects are created as part of my journey to master React and secure a Junior Frontend Developer position. Each project focuses on specific React concepts and patterns commonly used in real-world applications.

## Projects

### 1. Counter App

**Live Demo:** [View Counter App](https://lazytanakas.github.io/React-mini-projects/counter-app/)

A simple counter application with history tracking.

**Concepts practiced:**

- useState with numbers and arrays
- Event handlers
- Array manipulation (spread operator, slice)
- Conditional rendering
- List rendering with map()

**Features:**

- Increment/Decrement buttons
- Reset functionality
- History of last 5 actions
- Prevents negative values

---

### 2. Todo List

**Live Demo:** [View Todo List](https://lazytanakas.github.io/React-mini-projects/todo-list-app/)

A full-featured todo list application with advanced functionality.

**Concepts practiced:**

- Multiple useState hooks
- useEffect for side effects
- localStorage for data persistence
- Controlled inputs
- Conditional rendering with ternary operators
- Array methods (filter, map, sort)
- Inline styles and dynamic styling

**Features:**

- Add, edit, and delete tasks
- Mark tasks as completed with checkbox
- Three filter modes: All, Active, Completed
- Priority levels: Low, Medium, High
- Color-coded priority indicators
- Sort by priority
- Enter key to add tasks
- Clear all tasks
- Task counter
- Data persists after page reload

**Technical highlights:**

- Lazy initial state for localStorage
- Separate state management for edit mode
- Helper functions for filtering and sorting
- Dynamic color assignment based on priority

---

### 3. Calculator

**Live Demo:** [View Calculator](https://lazytanakas.github.io/React-mini-projects/calculator-app/)

A fully functional calculator with standard and percentage operations.

**Concepts practiced:**

- Multiple useState for state management
- Event handling with parameters
- String manipulation (replace, slice, includes)
- Type conversion (Number, String)
- Conditional logic with if/else
- Error handling (division by zero)

**Features:**

- Basic arithmetic operations (+, -, \*, /)
- Decimal number support with comma separator
- Percentage calculations (both standalone and in context)
- Backspace to delete last character
- All Clear (AC) button
- Display shows full operation (e.g., "52 + 23")
- European number format (comma as decimal separator)
- Error message for division by zero

**Technical highlights:**

- Smart number concatenation vs. replacement logic
- Complex percentage logic: 50% → 0,5 and 200 + 10% → 220
- String parsing to extract operands from display
- Automatic conversion between dots and commas for calculations

---

### 4. Weather App

**Live Demo:** [View Weather App](https://lazytanakas.github.io/React-mini-projects/weather-app/)

A React-based weather application with real-time data from OpenWeatherMap API.

**Concepts practiced:**

- useState with multiple state variables
- useEffect for API calls and localStorage sync
- Async/await for API requests
- Conditional rendering (loading/error/data states)
- Array methods (map, filter)
- Lazy initialization from localStorage
- Error handling with try/catch/finally
- Controlled components

**Features:**

- City search with real-time weather data
- Detailed information: temperature, wind speed, humidity, visibility
- Search history (last 7 cities)
- Light/Dark theme toggle with persistence
- Click on history to reload city weather
- Automatic duplicate prevention in history
- Data persists after page reload

**Technical highlights:**

- Integration with OpenWeatherMap API
- Environment variables for API key security
- Debounced search to avoid excessive API calls
- Loading and error state handling
- Theme persistence with localStorage
- Search history management with automatic trimming

---

### 5. Movie Search App

**Live Demo:** [View Movie Search App](https://lazytanakas.github.io/React-mini-projects/movie-search-app/)

A movie search application powered by The Movie Database (TMDb) API.

**Concepts practiced:**

- useState with multiple state variables
- useEffect with cleanup for debouncing
- Async/await for API requests
- setTimeout and clearTimeout for debounce implementation
- Conditional rendering (loading/error/empty states)
- Array methods (map)
- Error handling with try/catch/finally
- Controlled inputs
- Form submission prevention
- Environment variables for API key management

**Features:**

- Real-time movie search with debouncing (500ms delay)
- Movie cards with poster, title, release year, and rating
- Minimum 3 characters validation
- Search status indicators ("Searching...", "Type at least 3 characters...")
- Clear search button
- Placeholder image for movies without posters
- Error handling for failed requests
- Empty state message

**Technical highlights:**

- Debounced search implementation using useEffect and setTimeout
- Automatic cleanup of setTimeout to prevent memory leaks
- Query encoding with encodeURIComponent for safe API requests
- Conditional image loading with fallback placeholder
- Multiple loading states (isLoading, isTyping)
- TMDb API integration for movie data
- Responsive grid layout for movie cards
