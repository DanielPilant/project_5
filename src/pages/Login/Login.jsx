import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserByUsername } from '../../api.js';
import { UserContext } from '../../contexts/UserContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await getUserByUsername(username);
      if (!user || user.website !== password) {
        setError('Invalid username or password');
        return;
      }
      login(user);
      navigate('/home');
    } catch {
      setError('Login failed. Is the server running?');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      <p>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
