import { useState } from 'react'
import './App.css'

function App() {
  const [number1, setNumber1] = useState('')
  const [number2, setNumber2] = useState('')
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

    setNumber2(secondNumber)

    const num1 = Number(number1.replace(',', '.'))
    const num2 = Number(secondNumber.replace(',', '.'))
    let result

    if (operator === '+') {
      result = num1 + num2
    } else if (operator === '-') {
      result = num1 - num2
    } else if (operator === '*') {
      result = num1 * num2
    } else if (operator === '/') {
      if (num2 === 0) {
        setDisplay('Error')
        return
      }
      result = num1 / num2
    }

    setDisplay(String(result).replace('.', ','))
    setNumber1('')
    setNumber2('')
    setOperator('')
  }

  const handleClear = () => {
    setDisplay('0')
    setNumber1('')
    setNumber2('')
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

  return (
    <div className="calculator">
      <div className="display">{display}</div>

      <div className="row">
        <button onClick={handleBackspace}>⌫</button>
        <button onClick={handleClear}>AC</button>
        <button onClick={handlePercent}>%</button>
        <button onClick={() => handleOperatorClick('/')}>/</button>
      </div>

      <div className="row">
        <button onClick={() => handleNumberClick('7')}>7</button>
        <button onClick={() => handleNumberClick('8')}>8</button>
        <button onClick={() => handleNumberClick('9')}>9</button>
        <button onClick={() => handleOperatorClick('*')}>*</button>
      </div>

      <div className="row">
        <button onClick={() => handleNumberClick('4')}>4</button>
        <button onClick={() => handleNumberClick('5')}>5</button>
        <button onClick={() => handleNumberClick('6')}>6</button>
        <button onClick={() => handleOperatorClick('-')}>-</button>
      </div>

      <div className="row">
        <button onClick={() => handleNumberClick('1')}>1</button>
        <button onClick={() => handleNumberClick('2')}>2</button>
        <button onClick={() => handleNumberClick('3')}>3</button>
        <button onClick={() => handleOperatorClick('+')}>+</button>
      </div>

      <div className="row">
        <button onClick={() => handleNumberClick('0')}>0</button>
        <button onClick={handleDecimalClick}>,</button>
        <button onClick={handleEquals}>=</button>
      </div>
    </div>
  )
}

export default App
