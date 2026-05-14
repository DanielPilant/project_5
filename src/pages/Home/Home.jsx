import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext.jsx";
import InfoModal from "../../components/InfoModal.jsx";
import "./home.css";

const ROUTE_CARDS = [
  {
    key: "albums",
    title: "Albums",
    desc: "Browse your photo albums and manage the pictures inside them.",
    badge: "A",
  },
  {
    key: "posts",
    title: "Posts",
    desc: "Read, write and comment on posts shared by you and others.",
    badge: "P",
  },
  {
    key: "todos",
    title: "Todos",
    desc: "Keep track of tasks, mark them done and stay on top of your day.",
    badge: "T",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(UserContext);
  const [showInfo, setShowInfo] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
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
              {card.badge}
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
