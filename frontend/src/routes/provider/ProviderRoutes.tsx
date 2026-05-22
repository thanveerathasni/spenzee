import { Route } from "react-router-dom";

import ProviderRequest from "../../pages/provider/auth/ProviderRequest";

import ProviderLogin from "../../pages/provider/auth/ProviderLogin";

import ProviderPending from "../../pages/provider/auth/ProviderPending";

import ProviderSetupPassword from "../../pages/provider/auth/ProviderSetupPassword";

import ProviderForgotPassword from "../../pages/provider/auth/ProviderForgotPassword";

import ProviderResetPassword from "../../pages/provider/auth/ProviderResetPassword";

const ProviderRoutes = () => {

  return (
    <>
      <Route
        path="/provider/request"
        element={<ProviderRequest />}
      />

      <Route
        path="/provider/login"
        element={<ProviderLogin />}
      />

      <Route
        path="/provider/pending"
        element={<ProviderPending />}
      />

      <Route
        path="/provider/setup-password"
        element={<ProviderSetupPassword />}
      />

      <Route
        path="/provider/forgot-password"
        element={<ProviderForgotPassword />}
      />

      <Route
        path="/provider/reset-password"
        element={<ProviderResetPassword />}
      />
    </>
  );
};

export default ProviderRoutes;