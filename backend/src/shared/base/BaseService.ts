import { logger } from "../logger/logger";

export abstract class BaseService {
  protected logInfo(message: string, meta?: unknown): void {
    logger.info(message, meta);
  }

  protected logError(message: string, meta?: unknown): void {
    logger.error(message, meta);
  }
}
