import jwt from "jsonwebtoken";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { Role } from "../constants/roles";
import { TOKEN_CONFIG } from "../constants/token";

export interface JwtPayload {
  userId: string;
  role: Role;
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

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
  const decoded = jwt.verify(token, ACCESS_SECRET);

  if (typeof decoded === "string") {
    throw new Error(ERROR_MESSAGES.AUTH.INVALID_ACCESS_TOKEN_PAYLOAD);
  }

  return decoded as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, REFRESH_SECRET);

  if (typeof decoded === "string") {
    throw new Error(ERROR_MESSAGES.AUTH.INVALID_REFRESH_TOKEN_PAYLOAD);
  }

  return decoded as JwtPayload;
};
