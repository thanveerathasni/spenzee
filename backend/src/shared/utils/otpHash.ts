import bcrypt from "bcryptjs";
import crypto from "crypto";

// export const hashOtp = async (otp: string): Promise<string> => {
//   return bcrypt.hash(otp, 10);
// };



export const hashOtp = (otp: string): string => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

export const compareOtp = async (otp: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(otp, hash);
};
