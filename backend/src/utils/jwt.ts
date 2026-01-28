// import jwt from "jsonwebtoken";
// import { TOKEN_CONFIG } from "../constants/token";

// interface TokenPayload {
//   userId: string;
//   role: string;
// }

// export const generateAccessToken = (
//   payload: TokenPayload
// ): string => {
//   return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
//     expiresIn: TOKEN_CONFIG.ACCESS_TOKEN_EXPIRES_IN
//   });
// };

// export const generateRefreshToken = (
//   payload: TokenPayload
// ): string => {
//   return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
//     expiresIn: TOKEN_CONFIG.REFRESH_TOKEN_EXPIRES_IN
//   });
// };

// export const verifyRefreshToken = (token: string): TokenPayload => {
//   return jwt.verify(
//     token,
//     process.env.JWT_REFRESH_SECRET as string
//   ) as TokenPayload;
// };



import jwt from "jsonwebtoken";
import { TOKEN_CONFIG } from "../constants/token";

interface TokenPayload {
  userId: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: TOKEN_CONFIG.ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: TOKEN_CONFIG.REFRESH_TOKEN_EXPIRES_IN,
  });
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string
  ) as TokenPayload;
};
