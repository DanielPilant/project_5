import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserByUsername } from '../../api.js';
import { UserContext } from '../../contexts/UserContext.jsx';
import '../auth.css';

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
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="auth-card__subtitle">Sign in to continue to your account.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              className="auth-form__input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </div>
          <div className="auth-form__field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="auth-form__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button
            type="submit"
            className="auth-form__submit"
            disabled={submitting}
          >
            {submitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className="auth-card__footer">
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
