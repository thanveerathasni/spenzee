import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App";
import { Toaster } from 'react-hot-toast';



createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />

        <Toaster
    position="top-right"
    reverseOrder={false}
    toastOptions={{
      duration: 3000,
      style: {
        background: '#111111',
        color: '#ffffff',
        border: '1px solid rgba(255,255,255,0.1)',
      },
    }}
  />
    </GoogleOAuthProvider>
  </Provider>
);
