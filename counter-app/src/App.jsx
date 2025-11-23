import { useState } from 'react'
import './App.css'

const App = () => {
  const [counter, setCounter] = useState(0)
  const [history, setHistory] = useState([])

  const handleIncrement = () => {
    setCounter(counter + 1)
    setHistory([...history, '+1'].slice(-5))
  }

  const handleDecrement = () => {
    if (counter > 0) {
      setCounter(counter - 1)
      setHistory([...history, '-1'].slice(-5))
    }
  }

  const handleReset = () => {
    setCounter(0)
    setHistory([...history, 'RESET'].slice(-5))
  }

  return (
    <div>
      <h1>Counter</h1>
      <h2>{counter}</h2>

      <div className="buttons">
        <button onClick={handleIncrement}>+1</button>
        <button onClick={handleReset}>RESET</button>
        <button onClick={handleDecrement}>-1</button>
      </div>

      <div className="history">
        <h3>History</h3>
        <ul>
          {history.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
