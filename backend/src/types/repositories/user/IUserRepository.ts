import { IUser } from "../../../models/User.model";

import { Role } from "../../../shared/constants/roles";

export interface CreateUserData {
  name?: string;

  email: string;

  password: string | null;

  role: Role;

  isVerified: boolean;

  provider?:
    | "google"
    | "local";
}

export interface IUserRepository {
  findById(
    id: string,
  ): Promise<IUser | null>;

  findByEmail(
    email: string,
  ): Promise<IUser | null>;

  findByEmailWithPassword(
    email: string,
  ): Promise<IUser | null>;

  findByIdWithPassword(
    id: string,
  ): Promise<IUser | null>;

  create(
    data: CreateUserData,
  ): Promise<IUser>;

  verifyUser(
    email: string,
  ): Promise<void>;

  updatePassword(
    userId: string,
    password: string,
  ): Promise<void>;

  updateById(
    id: string,
    data: Partial<IUser>,
  ): Promise<IUser | null>;

  findAllPaginated(
    page: number,
    limit: number,
    search: string,
  ): Promise<{
    users: IUser[];

    total: number;

    page: number;

    totalPages: number;
  }>;
}