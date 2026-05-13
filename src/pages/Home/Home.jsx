import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, clearCurrentUser } from '../../auth.js';
import InfoModal from '../../components/InfoModal.jsx';

export default function Home() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [showInfo, setShowInfo] = useState(false);

  function handleLogout() {
    clearCurrentUser();
    navigate('/login');
  }

  return (
    <div className="page">
      <header>
        <h1>Hello, {currentUser.name || currentUser.username}</h1>
      </header>
      <nav className="home-nav">
        <button onClick={() => navigate(`/users/${currentUser.id}/albums`)}>
          Albums
        </button>
        <button onClick={() => navigate(`/users/${currentUser.id}/posts`)}>
          Posts
        </button>
        <button onClick={() => navigate(`/users/${currentUser.id}/todos`)}>
          Todos
        </button>
        <button onClick={() => setShowInfo(true)}>Info</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>
      {showInfo && (
        <InfoModal user={currentUser} onClose={() => setShowInfo(false)} />
      )}
    </div>
  );
}
