export interface IOtpRepository {
  create(
    email: string,
    otpHash: string,
    expiresAt: Date
  ): Promise<void>;

  findByEmail(
    email: string
  ): Promise<{
    otpHash: string;
    expiresAt: Date;
    attempts: number;
    firstRequestedAt: Date;
  } | null>;

  deleteByEmail(email: string): Promise<void>;

  incrementAttempts(email: string): Promise<void>;

  updateOtp(
    email: string,
    otpHash: string,
    expiresAt: Date
  ): Promise<void>;

  resetAttempts(email: string): Promise<void>;

}
