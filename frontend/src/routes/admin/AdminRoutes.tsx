import { Route } from "react-router-dom";

import AdminLogin from "../../pages/admin/Auth/AdminLogin";
import AdminProtectedRoute from "../AdminProtectedRoute";

//  NEW STRUCTURE IMPORTS
import AdminLayout from "../../layouts/admin/AdminLayout";
import DashboardPage from "../../pages/admin/dashboard/DashboardPage"

const AdminRoutes = () => {
  return (
    <>
      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Area */}
      <Route element={<AdminProtectedRoute />}>
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          }
        />
      </Route>
    </>
  );
};

export default AdminRoutes;
