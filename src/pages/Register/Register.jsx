import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserByUsername } from '../../api.js';
import { createUser } from './api.js';
import { setCurrentUser } from '../../auth.js';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    verifyPassword: '',
  });
  const [details, setDetails] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleCredentialsSubmit(e) {
    e.preventDefault();
    setError('');

    if (credentials.password !== credentials.verifyPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      const existing = await getUserByUsername(credentials.username);
      if (existing) {
        setError('Username already taken');
        return;
      }
      setStep(2);
    } catch {
      setError('Could not verify username. Is the server running?');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDetailsSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const newUser = await createUser({
        username: credentials.username,
        website: credentials.password,
        name: details.name,
        email: details.email,
      });
      setCurrentUser(newUser);
      navigate('/home');
    } catch {
      setError('Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <h1>Register</h1>
      {step === 1 && (
        <form onSubmit={handleCredentialsSubmit}>
          <div>
            <label htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              type="text"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="reg-verify">Verify Password</label>
            <input
              id="reg-verify"
              type="password"
              value={credentials.verifyPassword}
              onChange={(e) =>
                setCredentials({ ...credentials, verifyPassword: e.target.value })
              }
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Checking...' : 'Continue'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleDetailsSubmit}>
          <p>Welcome, {credentials.username}. Tell us about yourself.</p>
          <div>
            <label htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              type="text"
              value={details.name}
              onChange={(e) => setDetails({ ...details, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              value={details.email}
              onChange={(e) => setDetails({ ...details, email: e.target.value })}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create account'}
          </button>
        </form>
      )}

      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
