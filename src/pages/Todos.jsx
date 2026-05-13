import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserTodos, updateTodo, createTodo, deleteTodo } from '../api.js';
import { UserContext } from '../contexts/UserContext.jsx';
import './Albums/albums.css';

export default function Todos() {
  const { userId } = useParams();
  const { currentUser } = useContext(UserContext);

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('id');

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editTodoTitle, setEditTodoTitle] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getUserTodos(userId);
        if (!cancelled) setTodos(data);
      } catch {
        if (!cancelled) setError('Failed to load todos');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [userId]);

  async function handleToggle(todo) {
    const updated = { ...todo, completed: !todo.completed };
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    try {
      await updateTodo(todo.id, { completed: updated.completed });
    } catch {
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? todo : t)));
      setError('Failed to update todo');
    }
  }

  async function handleDelete(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTodo(id);
    } catch {
      setError('Failed to delete todo');
      const data = await getUserTodos(userId);
      setTodos(data);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    const newTodo = {
      userId: Number(userId),
      title: newTodoTitle,
      completed: false
    };
    try {
      const created = await createTodo(newTodo);
      setTodos((prev) => [...prev, created]);
      setNewTodoTitle('');
      setShowAddForm(false);
    } catch {
      setError('Failed to add todo');
    }
  }

  function handleEditStart(todo) {
    setEditingTodoId(todo.id);
    setEditTodoTitle(todo.title);
  }

  async function handleEditSave(id) {
    if (!editTodoTitle.trim()) return;
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, title: editTodoTitle } : t)));
    setEditingTodoId(null);
    try {
      await updateTodo(id, { title: editTodoTitle });
    } catch {
      setError('Failed to update todo title');
      const data = await getUserTodos(userId);
      setTodos(data);
    }
  }

  let filteredTodos = todos.filter((todo) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchTitle = todo.title.toLowerCase().includes(query);
      const matchId = todo.id.toString() === query;
      if (!matchTitle && !matchId) return false;
    }
    
    if (filterStatus === 'completed' && !todo.completed) return false;
    if (filterStatus === 'active' && todo.completed) return false;
    
    return true;
  });

  filteredTodos.sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'completed') return (a.completed === b.completed) ? 0 : (a.completed ? -1 : 1);
    return a.id - b.id;
  });

  return (
    <div className="albums-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h1>Todos - {currentUser?.name || currentUser?.username}</h1>
        <button 
          className="btn btn--primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add New Todo +'}
        </button>
      </div>

      {showAddForm && (
        <form className="album-form" onSubmit={handleAdd}>
          <h4 className="album-form__title">Create New Todo</h4>
          <input
            className="albums-search__input"
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Enter todo title..."
          />
          <button type="submit" className="btn btn--primary">Add</button>
        </form>
      )}

      <div className="albums-search" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          className="albums-search__input"
          style={{ flex: '1 1 200px' }}
          type="text"
          placeholder="Search by Title or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <select 
          className="albums-search__input" 
          style={{ width: 'auto', flex: '0 1 auto' }}
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Show All</option>
          <option value="completed">Completed Only</option>
          <option value="active">Active Only</option>
        </select>
        
        <select 
          className="albums-search__input" 
          style={{ width: 'auto', flex: '0 1 auto' }}
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="id">Sort by ID</option>
          <option value="title">Sort by Title (A-Z)</option>
          <option value="completed">Sort by Status</option>
        </select>
      </div>

      {loading && <p style={{ color: '#9ca3af' }}>Loading data...</p>}
      {error && <div className="error">{error}</div>}
      
      <ul className="album-list">
        {filteredTodos.map((todo, index) => (
          <li key={todo.id} className="album-item">
            <div className="album-item__content" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              
              {editingTodoId === todo.id ? (
                <div style={{ display: 'flex', gap: '10px', width: '100%', alignItems: 'center' }}>
                  <input
                    className="albums-search__input"
                    style={{ flex: 1, margin: 0 }}
                    type="text"
                    value={editTodoTitle}
                    onChange={(e) => setEditTodoTitle(e.target.value)}
                  />
                  <button className="btn btn--primary btn--small" onClick={() => handleEditSave(todo.id)}>Save</button>
                  <button className="btn btn--ghost btn--small" onClick={() => setEditingTodoId(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  
                  <div style={{ flex: 1, textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#9ca3af' : '#e5e7eb' }}>
                    <strong style={{ color: '#818cf8', marginRight: '5px' }}>#{index + 1}</strong> 
                    <span style={{ fontSize: '0.85rem', color: '#6b7280', marginRight: '5px' }}>(ID: {todo.id})</span>
                    {todo.title}
                  </div>

                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button className="btn btn--ghost btn--small" onClick={() => handleEditStart(todo)}>Edit</button>
                    <button className="btn btn--small" style={{ backgroundColor: '#dc2626', color: 'white', border: 'none' }} onClick={() => handleDelete(todo.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      
      {!loading && filteredTodos.length === 0 && (
        <div className="albums-empty">No todos matched your search.</div>
      )}
      
      <Link to="/home" className="back-link">← Back to Home</Link>
    </div>
  );
}