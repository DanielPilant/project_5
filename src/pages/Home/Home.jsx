import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext.jsx';
import InfoModal from '../../components/InfoModal.jsx';

export default function Home() {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(UserContext);
  const [showInfo, setShowInfo] = useState(false);

  function handleLogout() {
    logout();
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
