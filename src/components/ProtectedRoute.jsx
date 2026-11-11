import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, isSuperAdmin } from "../utils/auth";
import AccessDenied from "../pages/AccessDenied";

const ProtectedRoute = ({ superAdminOnly = false, children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (superAdminOnly && !isSuperAdmin()) {
    return <AccessDenied />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
