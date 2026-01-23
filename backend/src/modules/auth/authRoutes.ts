import { Router } from "express";
import {
  signup,
  login,
  googleLogin,
  refresh,
  logout,
  verifyOtp,
  resendOtp,
} from "./authController";
import { protect, allowRoles } from "../../shared/middleware/authMiddleware";
import { forgotPassword } from "./authController";
import { verifyForgotOtp } from "./authController";
import { resetPassword } from "./authController";



const router = Router();

router.post("/forgot-password", forgotPassword);

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/refresh", refresh);   
router.post("/logout", logout);
router.post("/google", googleLogin);
router.post("/verify-forgot-otp", verifyForgotOtp);
router.post("/reset-password", resetPassword);

router.get("/profile", protect, (req, res) => {
  res.json({ message: "You are logged in" });
});

router.get("/admin", protect, allowRoles("admin"), (req, res) => {
  res.json({ message: "Welcome admin" });
});

export default router;
