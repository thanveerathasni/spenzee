import { IUser } from "../../models/User.model";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;

  create(data: {
    email: string;
    password: string | null;
    role: "user" | "provider" | "admin";
    isVerified: boolean;
    provider?: "google" | "local";
  }): Promise<IUser>; 

  verifyUser(email: string): Promise<void>;
findById(id: string): Promise<IUser | null>;

  updatePassword(userId: string, password: string): Promise<void>;
}
