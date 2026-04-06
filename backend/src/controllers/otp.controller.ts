import { Request, Response } from "express";
import { OtpService } from "../services/otp.service";

const otpService = new OtpService();

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email: string };

    await otpService.sendOtp(email);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body as {
      email: string;
      otp: string;
    };

    await otpService.verifyOtp(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(400).json({
      success: false,
      message,
    });
  }
};