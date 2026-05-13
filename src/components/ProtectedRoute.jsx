import { useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useContext(UserContext);
  const { userId } = useParams();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (userId && currentUser.id.toString() !== userId) {
    alert("Access Denied: You cannot view other users' data!");
    return <Navigate to={`/users/${currentUser.id}/home`} replace />;
  }

  return children;
}
