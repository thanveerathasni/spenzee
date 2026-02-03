import { Request } from "express";

export interface AdminRequest extends Request {
  admin: {
    id: string;
    role: string;
  };
}
