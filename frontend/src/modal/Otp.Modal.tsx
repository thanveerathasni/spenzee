import { confirmEmailChangeApi } from "@/api/user.api";

const handleVerify = async () => {
  const otpValue = otp.join("");

  if (otpValue.length !== 6) {
    alert("Enter full OTP");
    return;
  }

  try {
    setLoading(true);

    const res = await confirmEmailChangeApi(email, otpValue);

    onSuccess(res.data.email);
    onClose();
  } catch (err: unknown) {
    alert("Invalid or expired OTP");
  } finally {
    setLoading(false);
  }
};