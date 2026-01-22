import { Router } from "express";
import {
  signup,
  login,
  refresh,      // ✅ FIXED
  logout,
  verifyOtp,
  resendOtp,
} from "./authController";
import { protect, allowRoles } from "../../shared/middleware/authMiddleware";

const router = Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/refresh", refresh);   
router.post("/logout", logout);

router.get("/profile", protect, (req, res) => {
  res.json({ message: "You are logged in" });
});

router.get("/admin", protect, allowRoles("admin"), (req, res) => {
  res.json({ message: "Welcome admin" });
});

export default router;
