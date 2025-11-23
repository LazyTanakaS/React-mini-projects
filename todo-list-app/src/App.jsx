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
    <div className="app-container">
      <h1>ToDo List</h1>
      <p className="task-count">Total tasks: {todos.length}</p>

      <div className="input-section">
        <input
          type="text"
          value={task}
          onChange={handleInputChange}
          placeholder="What needs to be done?"
          onKeyDown={handleKeyDown}
        />

        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button className="btn-add" onClick={handleAddTodo}>
          Add Task
        </button>
        <button className="btn-clear" onClick={handleClearAll}>
          Clear All
        </button>
      </div>

      <div className="filter-section">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="sort-section">
        <label>
          <input
            type="checkbox"
            checked={sortByPriority}
            onChange={e => setSortByPriority(e.target.checked)}
          />
          Sort by priority
        </label>
      </div>

      {todos.length === 0 && (
        <p className="empty-message">No tasks yet. Add one to get started!</p>
      )}
      {todos.length > 0 && (
        <ul className="todo-list">
          {getFilteredTodos().map(todo => (
            <li
              key={todo.id}
              className="todo-item"
              data-priority={todo.priority}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id)}
              />
              {todo.id === editingId ? (
                <div className="todo-content">
                  <input
                    type="text"
                    value={editText}
                    onChange={handleEditChange}
                  />
                  <div className="todo-actions">
                    <button className="btn-save" onClick={handleSaveEdit}>
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="todo-content">
                  <span
                    className={`todo-text ${todo.completed ? 'completed' : ''}`}
                  >
                    {todo.text}
                  </span>
                  <div className="todo-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleStartEdit(todo.id, todo.text)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
