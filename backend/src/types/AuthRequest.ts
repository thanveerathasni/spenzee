import { Request } from "express";
import { Role } from "../constants/roles";

export interface AuthUser {
  id: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
