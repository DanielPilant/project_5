import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getUserTodos, updateTodo } from '../api.js';

export default function Todos() {
  const { userId } = useParams();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    return () => {
      cancelled = true;
    };
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

  return (
    <div className="page">
      <h1>Todos</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo)}
              />{' '}
              <span className={todo.completed ? 'done' : ''}>{todo.title}</span>
            </label>
          </li>
        ))}
      </ul>
      {!loading && todos.length === 0 && <p>No todos.</p>}
      <Link to="/home">Back to home</Link>
    </div>
  );
}
