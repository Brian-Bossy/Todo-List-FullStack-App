// frontend/src/App.jsx (Vite uses .jsx)
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Or use fetch
import './App.css'; // For basic styling

// Define the backend API URL
const API_URL = 'https://todo-list-fullstack-app-backend.onrender.com'; // Match backend port

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTodoId, setEditingTodoId] = useState(null); // New state for tracking the editing todo's ID
  const [editText, setEditText] = useState(''); // New state for the edited text

  // --- Fetch Todos ---
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(API_URL);
        setTodos(response.data);
      } catch (err) {
        console.error("Error fetching todos:", err);
        setError('Failed to load todos. Please try refreshing.');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []); // Empty dependency array means run once on mount

  // --- Handle Input Change ---
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // --- Handle Add Todo ---
  const handleAddTodo = async (event) => {
    event.preventDefault(); // Prevent form submission from reloading page
    if (!inputValue.trim()) return; // Don't add empty todos

    try {
      const response = await axios.post(API_URL, { text: inputValue });
      setTodos([...todos, response.data]); // Add the new todo to the list
      setInputValue(''); // Clear the input field
    } catch (err) {
      console.error("Error adding todo:", err);
      setError('Failed to add todo.'); // Show error to user
    }
  };

  // --- Handle Toggle Complete (Optional) ---
  const handleToggleComplete = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { isCompleted: !todos.find(todo => todo._id === id)?.isCompleted });
      setTodos(todos.map(todo =>
        todo._id === id ? { ...todo, isCompleted: response.data.isCompleted } : todo
      ));
    } catch (err) {
      console.error("Error updating todo:", err);
      setError('Failed to update todo.');
    }
  };

  // --- Handle Edit Todo ---
  const handleEditTodo = (id, text) => {
    setEditingTodoId(id);
    setEditText(text);
  };

  // --- Handle Save Edit ---
  const handleSaveEdit = async (id, newText) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { text: newText });
      if (response.status === 200) {
        setTodos(
          todos.map((todo) =>
            todo._id === id ? { ...todo, text: response.data.text } : todo
          )
        );
        setEditingTodoId(null); // Exit edit mode
        setEditText(''); // Clear the edit text
      } else {
        console.error('Failed to update todo:', response.statusText);
        setError('Failed to update todo.');
      }
    } catch (err) {
      console.error("Error updating todo:", err);
      setError('Failed to update todo.');
    }
  };

  // --- Handle Delete Todo ---
  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`); // Corrected URL construction
      setTodos(todos.filter(todo => todo._id !== id)); // Remove from list
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError('Failed to delete todo.');
    }
  };

  return (
    <div className="app-container">
      <h1>My MERN Todo List</h1>

      {/* Add Todo Form */}
      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Add a new todo..."
          className="todo-input"
        />
        <button type="submit" className="add-button">Add</button>
      </form>

      {/* Loading and Error Messages */}
      {loading && <p>Loading todos...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Todo List */}
      {!loading && !error && (
        <ul className="todo-list">
          {todos.length === 0 && !loading && <p>No todos yet! Add one above.</p>}
          {todos.map((todo) => (
            <li key={todo._id} className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}>
              {editingTodoId === todo._id ? (
                <>
                  <input
                    type="text"
                    className="edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => handleSaveEdit(todo._id, editText)} className="save-button">
                    Save
                  </button>
                  <button onClick={() => setEditingTodoId(null)} className="cancel-button">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span onClick={() => handleToggleComplete(todo._id)} className="todo-text">
                    {todo.text}
                  </span>
                  <div className="todo-actions">
                    <button onClick={() => handleEditTodo(todo._id, todo.text)} className="edit-button">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteTodo(todo._id)} className="delete-button">
                      X
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;