import { UserDTO } from "../../../shared/dto/user/user.dto";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
}

export interface IAuthService {
  login(email: string, password: string): Promise<AuthResponse>;

  refreshAccessToken(refreshToken: string): Promise<AuthResponse>;

  logout(refreshToken: string): Promise<void>;

  signup(email: string, password: string): Promise<void>;

  verifyOtp(email: string, otp: string): Promise<void>;

  resendOtp(email: string): Promise<void>;

  forgotPassword(email: string): Promise<string | null>;

  sendResetPasswordEmail(email: string, resetToken: string): Promise<void>;

  resetPassword(token: string, newPassword: string): Promise<void>;

  googleLogin(credential: string): Promise<AuthResponse>;


sendEmailChangeOtp(email: string): Promise<void>;
verifyEmailChangeOtp(email: string, otp: string): Promise<void>;
updateEmail(userId: string, newEmail: string): Promise<any>;

sendPasswordOtp(userId: string): Promise<void>;
verifyPasswordOtp(email: string, otp: string): Promise<void>;
updatePassword(userId: string, newPassword: string): Promise<void>;

forgotPassword(email: string): Promise<string | null>;
sendResetPasswordEmail(email: string, token: string): Promise<void>;
resetPassword(token: string, newPassword: string): Promise<void>;


}




// import { AuthResponse } from "./IAuthService"; // keep your existing import if needed
// import { UserDTO } from "../../../shared/dto/user/user.dto";
// export interface IAuthService {
//   login(email: string, password: string): Promise<AuthResponse>;
//   refreshAccessToken(refreshToken: string): Promise<AuthResponse>;
//   logout(refreshToken: string): Promise<void>;
//   signup(email: string, password: string): Promise<void>;
//   verifyOtp(email: string, otp: string): Promise<void>;
//   resendOtp(email: string): Promise<void>;


//   forgotPassword(email: string): Promise<string | null>;
//   sendResetPasswordEmail(email: string, token: string): Promise<void>;
//   resetPassword(token: string, newPassword: string): Promise<void>;

//   sendEmailChangeOtp(email: string): Promise<void>;
//   verifyEmailChangeOtp(email: string, otp: string): Promise<void>;
//   updateEmail(userId: string, newEmail: string): Promise<any>;

//   sendPasswordOtp(userId: string): Promise<void>;
//   verifyPasswordOtp(email: string, otp: string): Promise<void>;
//   updatePassword(userId: string, newPassword: string): Promise<void>;
// }

