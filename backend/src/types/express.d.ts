import { IUser } from "../modules/user/userModel";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "user" | "provider" | "admin";
      };
    }
  }
}

export {};
