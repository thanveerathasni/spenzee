import { IUser } from "../../../models/User.model";
import { Role } from "../../../shared/constants/roles";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;

  create(data: {
    name?: string;
    email: string;
    password: string | null;
    role: Role;
    isVerified: boolean;
    provider?: "google" | "local";
  }): Promise<IUser>;

  verifyUser(email: string): Promise<void>;

  findById(id: string): Promise<IUser | null>;

  updatePassword(userId: string, password: string): Promise<void>;
}