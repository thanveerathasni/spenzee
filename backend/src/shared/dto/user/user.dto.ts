import { Role } from "../../constants/roles";

export interface UserDTO {
  id: string;
  email: string;
  role: Role;
  isVerified: boolean;
}