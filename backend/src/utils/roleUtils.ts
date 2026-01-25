import { Role, ROLES } from "../constants/roles";

export const isValidRole = (role: unknown): role is Role => {
  return Object.values(ROLES).includes(role as Role);
};
