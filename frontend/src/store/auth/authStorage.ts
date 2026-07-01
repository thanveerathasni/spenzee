import type {
  User,
} from "./auth.types";

/* ====================================================== */
/* TYPES */
/* ====================================================== */

interface PersistedAuth {
  accessToken: string;

  user: User;
}

/* ====================================================== */
/* STORAGE KEY */
/* ====================================================== */

const AUTH_KEY =
  "auth";

/* ====================================================== */
/* SAVE */
/* ====================================================== */

export const persistAuth =
  (
    accessToken: string,
    user: User,
  ): void => {
    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({
        accessToken,
        user,
      }),
    );
  };

/* ====================================================== */
/* LOAD */
/* ====================================================== */

export const loadAuth =
  (): PersistedAuth | null => {
    try {
      const raw =
        localStorage.getItem(
          AUTH_KEY,
        );

      if (!raw) {
        return null;
      }

      const parsed =
        JSON.parse(
          raw,
        ) as PersistedAuth;

      /* ============================================== */
      /* DO NOT TRUST OLD ACCESS TOKENS */
      /* ============================================== */

      return {
        accessToken: "",

        user:
          parsed.user,
      };
    } catch {
      return null;
    }
  };

/* ====================================================== */
/* CLEAR */
/* ====================================================== */

export const clearPersistedAuth =
  (): void => {
    localStorage.removeItem(
      AUTH_KEY,
    );
  };