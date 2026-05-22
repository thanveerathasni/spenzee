import { Route } from "react-router-dom";

import AdminLogin from "../../pages/admin/Auth/AdminLogin";
import AdminProtectedRoute from "../AdminProtectedRoute";

import AdminLayout from "../../layouts/admin/AdminLayout";
import DashboardPage from "../../pages/admin/dashboard/DashboardPage";
import AdminUsersPage from "../../pages/admin/users/AdminUsersPage";
import AdminUserDetails from "../../pages/admin/users/AdminUserDetails";
import AdminProviderDetails from "../../pages/admin/providers/AdminProviderDetails";

const AdminRoutes = () => {
  return (
    <>
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<AdminProtectedRoute />}>
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <AdminUsersPage />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/users/:id"
          element={
            <AdminLayout>
              <AdminUserDetails />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/providers/:id"
          element={
            <AdminLayout>
              <AdminProviderDetails />
            </AdminLayout>
          }
        />
      </Route>
    </>
  );
};

export default AdminRoutes;