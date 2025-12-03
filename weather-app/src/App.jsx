import { useState, useEffect } from 'react'
import './App.css'
import {
  FaCity,
  FaThermometerHalf,
  FaWind,
  FaTint,
  FaEye,
} from 'react-icons/fa'

function App() {
  const [cityInput, setCityInput] = useState('')
  const [weather, setWeather] = useState(() => {
    const savedWeather = localStorage.getItem('lastWeather')
    return savedWeather
      ? JSON.parse(savedWeather)
      : {
          cityName: '',
          country: '',
          temp: 0,
          windSpeed: 0,
          description: '',
          icon: '',
          humidity: 0,
          visibility: 0,
        }
  })

  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('weatherHistory')
    return savedHistory ? JSON.parse(savedHistory) : []
  })

  const [theme, setTheme] = useState('light')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchWeather = async city => {
    setLoading(true)
    setError(null)

    try {
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=eng`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('City not found')
      }
      const data = await response.json()

      setWeather({
        cityName: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        visibility: (data.visibility / 1000).toFixed(1),
      })

      const filteredHistory = history.filter(
        item => item.cityName !== data.name
      )

      const newHistoryItem = {
        cityName: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        icon: data.weather[0].icon,
      }

      const updateHistory = [newHistoryItem, ...filteredHistory].slice(0, 7)
      setHistory(updateHistory)

      localStorage.setItem('weatherHistory', JSON.stringify(updateHistory))
      setCityInput('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (weather.cityName) {
      localStorage.setItem('lastWeather', JSON.stringify(weather))
    }
  }, [weather])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className={`app ${theme}`}>
      <header>
        <h1>Weather App</h1>
        <p>Find out the weather by city name</p>

        <div className="theme-switcher">
          <input
            type="checkbox"
            className="theme-toggle-checkbox"
            id="theme-toggle"
            checked={theme === 'dark'}
            onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          />
          <label htmlFor="theme-toggle" className="theme-toggle-label">
            <span className="theme-toggle-slider"></span>
          </label>
        </div>
      </header>

      <form
        className="find"
        onSubmit={e => {
          e.preventDefault()
          fetchWeather(cityInput)
        }}
      >
        <input
          type="text"
          placeholder="Find your City..."
          value={cityInput}
          onChange={e => {
            setCityInput(e.target.value)
          }}
        />
        <button className="btn-search" type="submit">
          Search
        </button>
      </form>

      {error && (
        <div className="fails">
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="loader-container">
          <div className="loader-spinner"></div>
          <p>Loading weather data...</p>
        </div>
      )}

      {weather.cityName && (
        <div className="weather-card">
          <div className="card">
            <h2>
              <FaCity className="icon" />
              {weather.cityName},{weather.country}
            </h2>

            <div className="main-info">
              <FaThermometerHalf className="icon temp-icon" />
              <span className="temp">{weather.temp} °C</span>
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.description}
              />
            </div>

            <div className="additional-info">
              <div className="info">
                <FaWind className="icon" />
                <span className="label">WIND</span>
                <span className="value">{weather.windSpeed} m/s</span>
              </div>

              <div className="info">
                <FaTint className="icon" />
                <span className="label">HUMIDITY</span>
                <span className="value">{weather.humidity} %</span>
              </div>

              <div className="info">
                <FaEye className="icon" />
                <span className="label">VISIBILITY</span>
                <span className="value">{weather.visibility} km</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="recent-weather">
        {history.map(city => (
          <div
            className="history-card"
            key={city.cityName}
            onClick={() => {
              fetchWeather(city.cityName)
            }}
          >
            <h3>{city.cityName}</h3>
            <img
              src={`https://openweathermap.org/img/wn/${city.icon}.png`}
              alt="weather icon"
            />
            <p>{city.temp} °C</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
