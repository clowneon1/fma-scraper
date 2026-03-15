const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const fs = require("fs");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const LOG_MAX_FILES = process.env.LOG_MAX_FILES || "14d";
const LOG_MAX_SIZE = process.env.LOG_MAX_SIZE || "50m";
const APPLICATION = process.env.APPLICATION || "lofi-orbit";
const ARCHIVE_LOGS = String(process.env.ARCHIVE_LOGS).toLowerCase() === "true";
const LOG_PATH = process.env.LOG_PATH || "./logs";

// ensure log directory exists
if (!fs.existsSync(LOG_PATH)) {
  fs.mkdirSync(LOG_PATH, { recursive: true });
}

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  level: LOG_LEVEL,

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),

  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),

    new DailyRotateFile({
      dirname: LOG_PATH,
      filename: `${APPLICATION}-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      zippedArchive: ARCHIVE_LOGS,
      maxFiles: LOG_MAX_FILES,
      maxSize: LOG_MAX_SIZE,
    }),
  ],
});

module.exports = logger;
