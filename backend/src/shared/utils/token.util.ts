import jwt from "jsonwebtoken";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { Role } from "../constants/roles";
import { SYSTEM_MESSAGES } from "../constants/systemMessages";
import { TOKEN_CONFIG } from "../constants/token";
import { UnauthorizedError } from "../errors/errors";

export interface JwtPayload {
  userId: string;
  role: Role;
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error(SYSTEM_MESSAGES.CONFIG.MISSING_JWT_SECRETS);
}

export const createAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: TOKEN_CONFIG.ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const createRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: TOKEN_CONFIG.REFRESH_TOKEN_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);

    if (typeof decoded === "string") {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_ACCESS_TOKEN_PAYLOAD);
    }

    return decoded as JwtPayload;
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;
    throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
  }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);

    if (typeof decoded === "string") {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_REFRESH_TOKEN_PAYLOAD);
    }

    return decoded as JwtPayload;
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;
    throw new UnauthorizedError(ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID);
  }
};