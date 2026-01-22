import { Request, Response } from "express";
import { authService } from "./authService";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const data = await authService.signup(name, email, password, role);
    res.status(201).json(data);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    await authService.verifyOtp(email, otp);
    res.json({ message: "Account verified successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await authService.resendOtp(email);
    res.json({ message: "OTP resent" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const result = await authService.login(req.body.email, req.body.password);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ user: result.user, accessToken: result.accessToken });
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  const data = await authService.refresh(token);
  res.json(data);
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  await authService.logout(token);
  res.clearCookie("refreshToken");
  res.sendStatus(204);
};
