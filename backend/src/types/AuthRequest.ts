import { Request } from "express";
import { Role } from "../shared/constants/roles";

export interface AuthUser {
  id: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
