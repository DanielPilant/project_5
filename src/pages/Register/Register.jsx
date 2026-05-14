import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserByUsername, createUser } from "../../api.js";
import { UserContext } from "../../contexts/UserContext.jsx";
import "../auth.css";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    verifyPassword: "",
  });
  const [details, setDetails] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleCredentialsSubmit(e) {
    e.preventDefault();
    setError("");

    if (credentials.password !== credentials.verifyPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      const existing = await getUserByUsername(credentials.username);
      if (existing) {
        setError("Username already taken");
        return;
      }
      setStep(2);
    } catch {
      setError("Could not verify username. Is the server running?");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDetailsSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const newUser = await createUser({
        username: credentials.username,
        website: credentials.password,
        name: details.name,
        email: details.email,
      });
      login(newUser);
      navigate("/home");
    } catch {
      setError("Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create your account</h1>
        <p className="auth-card__subtitle">
          {step === 1
            ? "Pick a username and password to get started."
            : "Just a couple more details and you are in."}
        </p>

        {step === 1 && (
          <form className="auth-form" onSubmit={handleCredentialsSubmit}>
            <div className="auth-form__field">
              <label htmlFor="reg-username">Username</label>
              <input
                id="reg-username"
                className="auth-form__input"
                type="text"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                placeholder="Choose a username"
                autoComplete="username"
                required
              />
            </div>
            <div className="auth-form__field">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                className="auth-form__input"
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                placeholder="Choose a password"
                autoComplete="new-password"
                required
              />
            </div>
            <div className="auth-form__field">
              <label htmlFor="reg-verify">Verify Password</label>
              <input
                id="reg-verify"
                className="auth-form__input"
                type="password"
                value={credentials.verifyPassword}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    verifyPassword: e.target.value,
                  })
                }
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button
              type="submit"
              className="auth-form__submit"
              disabled={submitting}
            >
              {submitting ? "Checking..." : "Continue"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="auth-form" onSubmit={handleDetailsSubmit}>
            <p className="auth-form__greeting">
              Welcome, <strong>{credentials.username}</strong>. Tell us about
              yourself.
            </p>
            <div className="auth-form__field">
              <label htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                className="auth-form__input"
                type="text"
                value={details.name}
                onChange={(e) =>
                  setDetails({ ...details, name: e.target.value })
                }
                placeholder="Your full name"
                autoComplete="name"
                required
              />
            </div>
            <div className="auth-form__field">
              <label htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                className="auth-form__input"
                type="email"
                value={details.email}
                onChange={(e) =>
                  setDetails({ ...details, email: e.target.value })
                }
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button
              type="submit"
              className="auth-form__submit"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create account"}
            </button>
          </form>
        )}

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
