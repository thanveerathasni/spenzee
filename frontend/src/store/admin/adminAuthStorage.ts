import type {
  Admin,
} from "../../types/admin/adminAuth.types";

interface PersistedAdminAuth {
  accessToken: string;

  admin: Admin;
}

const ADMIN_AUTH_KEY =
  "admin_auth";

/* ====================================================== */
/* SAVE */
/* ====================================================== */

export const persistAdminAuth =
  (
    accessToken: string,
    admin: Admin,
  ): void => {
    localStorage.setItem(
      ADMIN_AUTH_KEY,
      JSON.stringify({
        accessToken,
        admin,
      }),
    );
  };

/* ====================================================== */
/* LOAD */
/* ====================================================== */

export const loadAdminAuth =
  (): PersistedAdminAuth | null => {
    try {
      const raw =
        localStorage.getItem(
          ADMIN_AUTH_KEY,
        );

      if (!raw) {
        return null;
      }

      return JSON.parse(
        raw,
      ) as PersistedAdminAuth;
    } catch {
      return null;
    }
  };

/* ====================================================== */
/* CLEAR */
/* ====================================================== */

export const clearPersistedAdminAuth =
  (): void => {
    localStorage.removeItem(
      ADMIN_AUTH_KEY,
    );
  };