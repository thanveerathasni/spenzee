// import { createContext, useState } from "react";
// import { refreshApi } from "../api/authApi";

// export const AuthContext = createContext<any>(null);

// export const AuthProvider = ({ children }: any) => {
//   const [accessToken, setAccessToken] = useState<string | null>(
//     localStorage.getItem("accessToken")
//   );
//   const [refreshToken, setRefreshToken] = useState<string | null>(
//     localStorage.getItem("refreshToken")
//   );

//   const saveTokens = (a: string, r: string) => {
//     setAccessToken(a);
//     setRefreshToken(r);
//     localStorage.setItem("accessToken", a);
//     localStorage.setItem("refreshToken", r);
//   };

//   const refreshAccess = async () => {
//     if (!refreshToken) return null;
//     const res = await refreshApi(refreshToken);
//     setAccessToken(res.data.accessToken);
//     localStorage.setItem("accessToken", res.data.accessToken);
//     return res.data.accessToken;
//   };

//   return (
//     <AuthContext.Provider
//       value={{ accessToken, refreshToken, saveTokens, refreshAccess }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
