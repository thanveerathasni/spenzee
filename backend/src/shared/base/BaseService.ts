import { logger } from "../logger/logger";

export abstract class BaseService {
  protected logInfo(message: string, meta?: unknown) {
    logger.info(message, meta);
  }

  protected logError(message: string, meta?: unknown) {
    logger.error(message, meta);
  }
}