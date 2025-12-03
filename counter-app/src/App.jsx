import { useState } from 'react'
import './App.css'

const App = () => {
  const [counter, setCounter] = useState(0)
  const [history, setHistory] = useState([])

  const handleIncrement = () => {
    setCounter(prev => prev + 1)
    setHistory(prev => [...prev, '+1'].slice(-5))
  }

  const handleDecrement = () => {
    setCounter(prev => {
      if (prev > 0) {
        setHistory(prevHistory => [...prevHistory, '-1'].slice(-5))
        return prev - 1
      }
      return prev
    })
  }

  const handleReset = () => {
    setCounter(0)
    setHistory(prev => [...prev, 'RESET'].slice(-5))
  }

  return (
    <div className="app-container">
      <h1>Counter</h1>

      <div className="counter-display">
        <h2>{counter}</h2>
      </div>

      <div className="buttons">
        <button onClick={handleIncrement}>+1</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleDecrement}>-1</button>
      </div>

      <div className="history">
        <h3>History</h3>
        <ul>
          {history.map((action, index) => (
            <li key={`${action}-${index}`}>{action}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
