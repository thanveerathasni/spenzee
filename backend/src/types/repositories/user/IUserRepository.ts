import { IUser } from "../../../models/User.model";
import { Role } from "../../../shared/constants/roles";

export interface CreateUserData {
  name?: string;
  email: string;
  password: string | null;
  role: Role;
  isVerified: boolean;
  provider?: "google" | "local";
}

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;

  create(data: CreateUserData): Promise<IUser>;

  verifyUser(email: string): Promise<void>;

  findById(id: string): Promise<IUser | null>;

  updatePassword(userId: string, password: string): Promise<void>;
  update(
  filter: Record<string, unknown>,
  update: Record<string, unknown>
): Promise<IUser | null>;
}
