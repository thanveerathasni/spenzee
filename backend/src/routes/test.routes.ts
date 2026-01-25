import { Router } from "express";
import { authGuard } from "../middleware/authGuard";
import { roleGuard } from "../middleware/roleGuard";
import { ROLES } from "../constants/roles";

const router = Router();

// user-only route
router.get(
  "/user",
  authGuard,
  roleGuard([ROLES.USER]),
  (_req, res) => {
    res.json({ message: "User access granted" });
  }
);

// admin-only route
router.get(
  "/admin",
  authGuard,
  roleGuard([ROLES.ADMIN]),
  (_req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

export default router;
