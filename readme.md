# React Mini Projects

A collection of practice projects built while learning React fundamentals.

## Purpose

These projects are created as part of my journey to master React and secure a Junior Frontend Developer position. Each project focuses on specific React concepts and patterns commonly used in real-world applications.

## Projects

### 1. Counter App

**Live Demo:** [View Counter App](https://lazytanakas.github.io/FrontEnd-Learning/01-counter/)

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

**Live Demo:** [View Todo List](https://lazytanakas.github.io/FrontEnd-Learning/02-todo-list/)

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

**Live Demo:** [View Calculator](https://lazytanakas.github.io/FrontEnd-Learning/03-calculator/)

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

**Live Demo:** [View Weather App](https://lazytanakas.github.io/FrontEnd-Learning/04-weather-app/)

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
- Automatic duplicate handling in history
- Loading and error states
- Responsive design with CSS custom properties
- Beautiful gradients and animations

**Technical highlights:**

- Single object state for related weather data
- Smart history management (filters duplicates, updates temperatures)
- Theme system with CSS variables
- Multiple useEffect hooks for different side effects
- Integration with external API (OpenWeatherMap)
- React Icons library usage
- localStorage for persistence (history, last city, theme)

---

## Learning Goals

- Master React hooks (useState, useEffect)
- Understand component state management
- Practice with forms and controlled components
- Work with localStorage API
- Implement filtering and sorting logic
- Build user-friendly interfaces
- Handle complex conditional logic
- Work with string manipulation and type conversion
- Integrate external APIs
- Handle async operations and loading states

## Technologies

- React 18
- JavaScript (ES6+)
- Vite
- CSS3
- React Icons
- External APIs (OpenWeatherMap)

## Future Plans

- Refactor projects into smaller components
- Add TypeScript
- Implement custom hooks
- Add unit tests
- Improve styling and responsiveness
- Add more features to existing projects
- Build more complex applications

## Status

Active learning project. Regular updates as I continue my React education.

## Timeline

Started: November 2024
Current focus: Building practical React applications, mastering hooks, and API integration

## About

These projects are part of my self-taught journey to become a Frontend Developer. I dedicate 2 hours daily to hands-on coding practice, focusing on understanding concepts deeply rather than just copying solutions.
