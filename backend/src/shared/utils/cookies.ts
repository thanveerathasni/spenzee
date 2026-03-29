import { Response } from "express";
import { TOKEN_CONFIG } from "../constants/token";

export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie(TOKEN_CONFIG.COOKIE_NAME, token, {
    httpOnly: true,
    secure: false, 
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_CONFIG.REFRESH_TOKEN_MAX_AGE,
  });
};

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie(TOKEN_CONFIG.COOKIE_NAME, {
    path: "/",
  });
};