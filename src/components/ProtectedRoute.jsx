import { Navigate, Outlet } from "react-router-dom";

/**
 * ProtectedRoute — wraps all admin routes.
 * Redirects to /login if no accessToken is stored in localStorage.
 */
const ProtectedRoute = () => {
  const token = localStorage.getItem("accessToken");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
