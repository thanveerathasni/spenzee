import bcrypt from "bcryptjs";

const OTP_EXPIRY_MINUTES = 5; // centralize this later if needed

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getOtpExpiry = (): Date => {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
};

export const hashOtp = async (otp: string): Promise<string> => {
  return bcrypt.hash(otp, 10);
};

export const compareOtp = async (
  otp: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(otp, hash);
};