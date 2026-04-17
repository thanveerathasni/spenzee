import { Route } from "react-router-dom";

import ProviderRequest from "../../pages/provider/auth/ProviderRequest";
import ProviderLogin from "../../pages/provider/auth/ProviderLogin";
import ProviderPending from "../../pages/provider/auth/ProviderPending";
import ProviderSetupPassword from "../../pages/provider/auth/ProviderSetupPassword";

const ProviderRoutes = () => {
  return (
    <>
      <Route path="/provider/request" element={<ProviderRequest />} />
      <Route path="/provider/login" element={<ProviderLogin />} />
      <Route path="/provider/pending" element={<ProviderPending />} />
      <Route path="/provider/setup-password" element={<ProviderSetupPassword />} />
    </>
  );
};

export default ProviderRoutes;