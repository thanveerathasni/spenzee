import { Response } from "express";
import { TOKEN_CONFIG } from "../constants/token";

export const setRefreshTokenCookie = (
  res: Response,
  token: string
): void => {
  res.cookie(TOKEN_CONFIG.COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/auth/refresh"
  });
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie(TOKEN_CONFIG.COOKIE_NAME, {
    path: "/auth/refresh"
  });
};
