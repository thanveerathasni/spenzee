import { Role } from "../shared/constants/roles";

declare global {
  namespace Express {
    interface AuthPayload {
      id: string;
      role: Role;
    }

    interface Request {
      user?: AuthPayload;
      admin?: AuthPayload;
      provider?: AuthPayload;
    }
  }
}

export {};