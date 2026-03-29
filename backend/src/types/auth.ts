import { Role } from "../shared/constants/roles";

export interface AuthUser {
  id: string;
  role: Role;
}