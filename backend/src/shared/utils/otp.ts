export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const otpExpiry = () => {
  return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
};


export const generateOTPData = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 60 * 1000); // 60 seconds
  return { otp, expiresAt };
};
