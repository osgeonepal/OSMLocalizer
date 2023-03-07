import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const LoggedInRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  return user ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} />
  );
};
