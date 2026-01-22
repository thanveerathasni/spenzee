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
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const data = await authService.refresh(refreshToken);
    res.json(data);
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    res.json({ message: "Logged out successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
