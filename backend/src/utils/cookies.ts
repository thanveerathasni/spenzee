import { Response } from "express";
import { TOKEN_CONFIG } from "../constants/token";

// export const setRefreshTokenCookie = (
//   res: Response,
//   token: string
// ): void => {
//   res.cookie(TOKEN_CONFIG.COOKIE_NAME, token, {
//     httpOnly: true,

//     secure: false,

//     sameSite: "lax",

//     path: "/auth/refresh",

//     maxAge: TOKEN_CONFIG.REFRESH_TOKEN_MAX_AGE,
//   });
// };

// export const clearRefreshTokenCookie = (res: Response): void => {
//   res.clearCookie(TOKEN_CONFIG.COOKIE_NAME, {
//     path: "/auth/refresh",
//   });
// };

export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: false,          // localhost
    sameSite: "lax",
    path: "/",             
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie("refreshToken", {
    path: "/",              
  });
};
