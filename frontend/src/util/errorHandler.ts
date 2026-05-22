import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
}

export const mapApiError = (
  err: unknown
): { field?: string; message: string } => {
  if (err instanceof AxiosError) {
    const axiosErr = err as AxiosError<ApiErrorResponse>;

    const msg = axiosErr.response?.data?.message;

    switch (msg) {
      case "Invalid OTP":
        return { field: "otp", message: "Incorrect OTP. Please try again." };

      case "OTP expired":
        return { field: "otp", message: "OTP expired. Click resend." };

      case "Too many attempts":
        return { field: "otp", message: "Too many attempts. Try again later." };

      case "Email already exists":
      case "Email already in use":
        return { field: "email", message: "Email already registered." };

      case "User not found":
        return { field: "email", message: "No account found with this email." };

      case "Invalid credentials":
        return { field: "password", message: "Wrong password." };

      case "Invalid old password":
        return { field: "password", message: "Current password is incorrect." };

      default:
        return {
          message: msg || "Something went wrong",
        };
    }
  }

  return { message: "Network error. Please try again." };
};
