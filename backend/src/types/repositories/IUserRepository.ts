import { IUser } from "../../models/User.model";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;

  create(data: {
    email: string;
    password: string;
    role: "user" | "provider" | "admin";
    isVerified: boolean;
  }): Promise<void>;

  verifyUser(email: string): Promise<void>;
}
