import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext.jsx';
import InfoModal from '../../components/InfoModal.jsx';
import './home.css';

const ROUTE_CARDS = [
  {
    key: 'albums',
    title: 'Albums',
    desc: 'Browse your photo albums and manage the pictures inside them.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="9" r="1.5" />
        <path d="M21 16l-5-5L5 21" />
      </svg>
    ),
  },
  {
    key: 'posts',
    title: 'Posts',
    desc: 'Read, write and comment on posts shared by you and others.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h6" />
      </svg>
    ),
  },
  {
    key: 'todos',
    title: 'Todos',
    desc: 'Keep track of tasks, mark them done and stay on top of your day.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 12l3 3 5-6" />
      </svg>
    ),
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(UserContext);
  const [showInfo, setShowInfo] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const displayName = currentUser.name || currentUser.username;

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-header__greeting">
          <h1>Hello, {displayName}</h1>
          <p>What would you like to do today?</p>
        </div>
        <div className="home-header__actions">
          <button
            type="button"
            className="home-action"
            onClick={() => setShowInfo(true)}
          >
            Info
          </button>
          <button
            type="button"
            className="home-action home-action--danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <section className="home-cards">
        {ROUTE_CARDS.map((card) => (
          <button
            key={card.key}
            type="button"
            className="home-card"
            onClick={() => navigate(`/users/${currentUser.id}/${card.key}`)}
          >
            <span className="home-card__icon" aria-hidden="true">
              {card.icon}
            </span>
            <h2 className="home-card__title">{card.title}</h2>
            <p className="home-card__desc">{card.desc}</p>
            <span className="home-card__cta">Open {card.title} →</span>
          </button>
        ))}
      </section>

      {showInfo && (
        <InfoModal user={currentUser} onClose={() => setShowInfo(false)} />
      )}
    </div>
  );
}
