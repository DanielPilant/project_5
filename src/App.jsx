import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import Home from './pages/Home/Home.jsx';
import Todos from './pages/Todos.jsx';
import Posts from './pages/Posts.jsx';
import Albums from './pages/Albums/Albums.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:userId/todos"
        element={
          <ProtectedRoute>
            <Todos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:userId/posts"
        element={
          <ProtectedRoute>
            <Posts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:userId/albums"
        element={
          <ProtectedRoute>
            <Albums />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
