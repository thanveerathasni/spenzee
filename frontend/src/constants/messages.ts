export const ALERT_MESSAGES = {
  AUTH: {
    LOGOUT_TITLE: "Log out?",
    LOGOUT_TEXT: "You will be signed out of your account.",
    LOGOUT_CONFIRM: "Logout",
    LOGOUT_CANCEL: "Cancel",
    
    LOGIN_SUCCESS: "Login successful",
    LOGIN_FAILED: "Login failed",
    
    SIGNUP_SUCCESS: "Signup successful",
    SIGNUP_FAILED: "Signup failed",
    
    GOOGLE_LOGIN_SUCCESS: "Google login successful",
    GOOGLE_LOGIN_FAILED: "Google login failed",
    GOOGLE_SIGNUP_SUCCESS: "Google signup successful",
    GOOGLE_SIGNUP_FAILED: "Google signup failed",
    
    PASSWORD_RESET_SUCCESS: "Password reset successful",
    PASSWORD_RESET_FAILED: "Password reset failed",
    FORGOT_PASSWORD_SUCCESS: "Reset link sent to your email",
    FORGOT_PASSWORD_FAILED: "Failed to send reset email",

    OTP_SENT: "OTP sent to your email",
    OTP_VERIFICATION_SUCCESS: "Account verified successfully",
    OTP_VERIFICATION_FAILED: "OTP verification failed",
    OTP_RESEND_SUCCESS: "OTP resent",
    OTP_RESEND_FAILED: "Resend failed",
  },
} as const;
