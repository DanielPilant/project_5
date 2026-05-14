import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserTodos, updateTodo, createTodo, deleteTodo } from '../../api.js';
import { UserContext } from '../../contexts/UserContext.jsx';
import AddTodoForm from './components/AddTodoForm';
import TodoFilters from './components/TodoFilters';
import TodoList from './components/TodoList';
import '../Albums/albums.css';

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

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
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

  const handleAdd = async (title) => {
    try {
      const created = await createTodo({ userId: Number(userId), title, completed: false });
      setTodos(prev => [...prev, created]);
      setShowAddForm(false);
    } catch { setError('Failed to add todo'); }
  };

  const handleToggle = async (todo) => {
    const updated = { ...todo, completed: !todo.completed };
    setTodos(prev => prev.map(t => t.id === todo.id ? updated : t));
    try { await updateTodo(todo.id, { completed: updated.completed }); }
    catch { setError('Failed to update todo'); }
  };

  const handleUpdateTitle = async (id, title) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, title } : t));
    try { await updateTodo(id, { title }); }
    catch { setError('Failed to update title'); }
  };

  const handleDelete = async (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
    try { await deleteTodo(id); }
    catch { setError('Failed to delete todo'); }
  };

  const filteredTodos = todos
    .filter(t => {
      const matchText = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toString() === searchQuery;
      if (filterStatus === 'completed') return matchText && t.completed;
      if (filterStatus === 'active') return matchText && !t.completed;
      return matchText;
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'completed') return a.completed === b.completed ? 0 : a.completed ? -1 : 1;
      return a.id - b.id;
    });

  return (
    <div className="albums-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h1>Todos - {currentUser?.name || currentUser?.username}</h1>
        <button className="btn btn--primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New Todo +'}
        </button>
      </div>

      {showAddForm && <AddTodoForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />}

      <TodoFilters 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
        sortBy={sortBy} setSortBy={setSortBy}
      />

      {loading && <p style={{ color: '#9ca3af' }}>Loading...</p>}
      {error && <div className="error">{error}</div>}
      
      <TodoList 
        todos={filteredTodos} 
        onToggle={handleToggle} 
        onDelete={handleDelete} 
        onUpdate={handleUpdateTitle} 
      />
      
      {!loading && filteredTodos.length === 0 && <div className="albums-empty">No todos found.</div>}
      <Link to="/home" className="back-link">← Back to Home</Link>
    </div>
  );
}