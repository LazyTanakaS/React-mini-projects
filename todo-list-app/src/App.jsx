import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // ===== STATE =====
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos')
    return savedTodos ? JSON.parse(savedTodos) : []
  })
  const [task, setTask] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [filter, setFilter] = useState('all')
  const [priority, setPriority] = useState('medium')
  const [sortByPriority, setSortByPriority] = useState(false)

  const handleInputChange = e => {
    setTask(e.target.value)
  }

  // ===== EFFECTS =====
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // ===== HANDLERS - ADD/DELETE =====
  const handleAddTodo = () => {
    if (task.trim() === '') {
      return
    }

    const newTodo = {
      id: Math.random(),
      text: task,
      completed: false,
      priority,
    }

    setTodos([...todos, newTodo])
    setTask('')
  }

  const handleDeleteTodo = id => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handleEditChange = e => {
    setEditText(e.target.value)
  }

  // ===== HANDLERS - EDIT =====
  const handleStartEdit = (id, currentText) => {
    setEditingId(id)
    setEditText(currentText)
  }

  const handleSaveEdit = () => {
    setTodos(
      todos.map(todo => {
        if (todo.id === editingId) {
          return { ...todo, text: editText }
        }
        return todo
      })
    )

    setEditingId(null)
    setEditText('')
    setPriority('medium')
  }

  const handleClearAll = () => {
    setTodos([])
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleAddTodo()
    }
  }

  // ===== HELPERS =====
  const getFilteredTodos = () => {
    let filtered = todos

    if (filter === 'active') {
      filtered = todos.filter(todo => !todo.completed)
    }

    if (filter === 'completed') {
      filtered = todos.filter(todo => todo.completed)
    }

    if (sortByPriority) {
      const priorityOrder = { high: 1, medium: 2, low: 3 }
      filtered = [...filtered].sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      })
    }

    return filtered
  }

  const getPriorityColor = priority => {
    if (priority === 'low') return 'green'
    if (priority === 'medium') return 'orange'
    if (priority === 'high') return 'red'
    return 'gray'
  }

  // ===== HANDLERS - TOGGLE =====
  const handleToggleComplete = id => {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed }
        }

        return todo
      })
    )
  }

  return (
    <div>
      <h1>ToDo List</h1>
      <p>Total tasks: {todos.length}</p>
      <input
        type="text"
        value={task}
        onChange={handleInputChange}
        placeholder="Enter the text..."
        onKeyDown={handleKeyDown}
      />

      <select value={priority} onChange={e => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button onClick={handleAddTodo}>Add</button>
      <button onClick={handleClearAll}>Clear ALL</button>

      <div>
        <button
          onClick={() => setFilter('all')}
          style={{ fontWeight: filter === 'all' ? 'bold' : 'normal' }}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          style={{ fontWeight: filter === 'active' ? 'bold' : 'normal' }}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          style={{ fontWeight: filter === 'completed' ? 'bold' : 'normal' }}
        >
          Completed
        </button>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={sortByPriority}
            onChange={e => setSortByPriority(e.target.checked)}
          />
          Sort by priority
        </label>
      </div>

      {todos.length === 0 && <p>No task yet</p>}
      {todos.length > 0 && (
        <ul>
          {getFilteredTodos().map(todo => (
            <li
              key={todo.id}
              style={{
                borderLeft: `4px solid ${getPriorityColor(todo.priority)}`,
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id)}
              />
              {todo.id === editingId ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={handleEditChange}
                  />
                  <button onClick={handleSaveEdit}>Save</button>
                </>
              ) : (
                <>
                  <span
                    style={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                    }}
                  >
                    {todo.text}
                  </span>
                  <button onClick={() => handleStartEdit(todo.id, todo.text)}>
                    Edit
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  handleDeleteTodo(todo.id)
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
