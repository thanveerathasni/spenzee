import api from "../api/axios";

export const authRepository = {
  signup: (data: {
    name: string;
    email: string;
    password: string;
    role: "user" | "provider" | "admin";
  }) => {
    return api.post("/auth/signup", data);
  },

  login: (data: { email: string; password: string }) => {
    return api.post("/auth/login", data);
  },

  refresh: (refreshToken: string) => {
    return api.post("/auth/refresh", { refreshToken });
  },

  logout: (refreshToken: string) => {
    return api.post("/auth/logout", { refreshToken });
  },

  profile: () => {
    return api.get("/auth/profile");
  },
};
