import { Navigate, Outlet } from "react-router-dom";
import { adminAuthStore } from "../store/admin/adminAuth";

const AdminProtectedRoute = () => {
  const token = adminAuthStore.getToken();

  return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;