import { Request } from "express";
import { Role } from "../constants/roles";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
  };
}
