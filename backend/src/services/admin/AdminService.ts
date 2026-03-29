import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { logger } from "../../shared/logger/logger";

@injectable()
export class AdminService {
  async getDashboard() {
    logger.info("Admin dashboard accessed");
    return { users: 0 };
  }
}