import jwt from "jsonwebtoken";

export const createAccessToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};
