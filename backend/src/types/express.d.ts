import { Role } from "../shared/constants/roles";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      role: Role;
    }

    interface Request {
      user?: UserPayload;
      admin?: {
        id: string;
        role: Role;
      };
      provider?: {
        id: string;
        role: Role;
      };
    }
  }
}

export {};