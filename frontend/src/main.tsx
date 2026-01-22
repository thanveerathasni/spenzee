import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </Provider>
);
