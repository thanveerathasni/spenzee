import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  id: string;
  role: "user" | "provider" | "admin";
}

interface Props {
  children: React.ReactNode;
  role?: "user" | "provider" | "admin";
}

const ProtectedRoute = ({ children, role }: Props) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 🔥 THIS triggers refresh if accessToken is missing
        const res = await api.get("/auth/profile");

        const token = localStorage.getItem("accessToken");
        if (!token) return setAllowed(false);

        const decoded = jwtDecode<TokenPayload>(token);

        if (role && decoded.role !== role) {
          setAllowed(false);
        } else {
          setAllowed(true);
        }
      } catch {
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return null; // or loader
  if (!allowed) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
