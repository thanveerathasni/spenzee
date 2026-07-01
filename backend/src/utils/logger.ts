type LogMeta = Record<string, string | number | boolean | Date | undefined>;

const writeLog = (
  level: "info" | "warn" | "error",
  message: string,
  meta?: LogMeta
): void => {
  const payload = {
    level,
    message,
    meta,
    timestamp: new Date().toISOString(),
  };

  process.stdout.write(`${JSON.stringify(payload)}\n`);
};

export const logger = {
  info: (message: string, meta?: LogMeta): void => writeLog("info", message, meta),
  warn: (message: string, meta?: LogMeta): void => writeLog("warn", message, meta),
  error: (message: string, meta?: LogMeta): void => writeLog("error", message, meta),
};
