import { useState } from 'react'
import './App.css'

function App() {
  const [number1, setNumber1] = useState('')
  const [operator, setOperator] = useState('')
  const [display, setDisplay] = useState('0')

  const handleNumberClick = num => {
    if (display === '0') {
      setDisplay(num)
    } else {
      setDisplay(display + num)
    }
  }

  const handleDecimalClick = () => {
    if (!display.includes(',')) {
      setDisplay(display + ',')
    }
  }

  const handleOperatorClick = op => {
    if (number1 && operator && display !== '0') {
      handleEquals()
    }

    setNumber1(display)

    setOperator(op)

    setDisplay(display + ' ' + op + ' ')
  }

  const handleEquals = () => {
    const toRemove = number1 + ' ' + operator + ' '
    const secondNumber = display.replace(toRemove, '')

    const num1 = Number(number1.replace(',', '.'))
    const num2 = Number(secondNumber.replace(',', '.'))

    const operations = {
      '+': (a, b) => a + b,
      '-': (a, b) => a - b,
      '*': (a, b) => a * b,
      '/': (a, b) => (b === 0 ? null : a / b),
    }

    const result = operations[operator](num1, num2)

    setDisplay(String(result).replace('.', ','))
    setNumber1('')
    setOperator('')
  }

  const handleClear = () => {
    setDisplay('0')
    setNumber1('')
    setOperator('')
  }

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
    }
  }

  const handlePercent = () => {
    if (!operator) {
      const num = Number(display.replace(',', '.'))
      const result = num / 100
      setDisplay(String(result).replace('.', ','))
    } else {
      const toRemove = number1 + ' ' + operator + ' '
      const secondNumber = display.replace(toRemove, '')

      const num1 = Number(number1.replace(',', '.'))
      const num2 = Number(secondNumber.replace(',', '.'))

      const result = (num2 * num1) / 100
      setDisplay(
        number1 + ' ' + operator + ' ' + String(result).replace('.', ',')
      )
    }
  }

  const numberButtons = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
  ]

  const operators = [
    { symbol: '/', op: '/' },
    { symbol: '*', op: '*' },
    { symbol: '-', op: '-' },
    { symbol: '+', op: '+' },
  ]

  return (
    <div className="calculator">
      <div className="display">{display}</div>

      <div className="row">
        <button onClick={handleBackspace}>⌫</button>
        <button onClick={handleClear}>AC</button>
        <button onClick={handlePercent}>%</button>
        <button onClick={() => handleOperatorClick('/')}>/</button>
      </div>

      {numberButtons.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map(num => (
            <button key={num} onClick={() => handleNumberClick(num)}>
              {num}
            </button>
          ))}
          <button onClick={() => handleOperatorClick(operators[rowIndex].op)}>
            {operators[rowIndex].symbol}
          </button>
        </div>
      ))}

      <div className="row">
        <button onClick={() => handleNumberClick('0')}>0</button>
        <button onClick={handleDecimalClick}>,</button>
        <button onClick={handleEquals}>=</button>
      </div>
    </div>
  )
}

export default App
