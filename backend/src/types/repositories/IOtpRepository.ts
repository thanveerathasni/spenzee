export interface IOtpRecord {
  email: string;

  otpHash: string;

  expiresAt: Date;

  attempts: number;

  createdAt: Date;

  firstRequestedAt: Date;
}

export interface IOtpRepository {
  create(
    email: string,
    otpHash: string,
    expiresAt: Date,
  ): Promise<IOtpRecord>;

  findByEmail(
    email: string,
  ): Promise<IOtpRecord | null>;

  deleteByEmail(
    email: string,
  ): Promise<void>;

  incrementAttempts(
    email: string,
  ): Promise<void>;

  updateOtp(
    email: string,
    otpHash: string,
    expiresAt: Date,
  ): Promise<void>;

  resetAttempts(
    email: string,
  ): Promise<void>;
}