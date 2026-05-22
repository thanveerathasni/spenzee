import { Response } from "express";

import { TOKEN_CONFIG } from "../constants/token";

/* ====================================================== */
/* COOKIE OPTIONS */
/* ====================================================== */

const COOKIE_OPTIONS = {
  httpOnly: true,

  secure: false,

  sameSite:
    "lax" as const,

  path: "/",
};

/* ====================================================== */
/* SET REFRESH TOKEN COOKIE */
/* ====================================================== */

export const setRefreshTokenCookie =
  (
    res: Response,
    token: string,
  ) => {
    res.cookie(
      TOKEN_CONFIG.COOKIE_NAME,
      token,
      {
        ...COOKIE_OPTIONS,

        maxAge:
          TOKEN_CONFIG
            .REFRESH_TOKEN_MAX_AGE,
      },
    );
  };

/* ====================================================== */
/* CLEAR REFRESH TOKEN COOKIE */
/* ====================================================== */

export const clearRefreshTokenCookie =
  (
    res: Response,
  ) => {
    res.clearCookie(
      TOKEN_CONFIG.COOKIE_NAME,
      COOKIE_OPTIONS,
    );
  };