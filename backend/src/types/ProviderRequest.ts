import { Request } from "express";

export interface ProviderRequest extends Request {
  provider: {
    id: string;
    role: string;
  };
}
