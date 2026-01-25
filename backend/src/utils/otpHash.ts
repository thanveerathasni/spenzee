import bcrypt from "bcryptjs";

export const hashOtp = async (otp: string): Promise<string> => {
  return bcrypt.hash(otp, 10);
};

export const compareOtp = async (
  otp: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(otp, hash);
};
