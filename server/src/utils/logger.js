// logger.js

const winston = require("winston");
const { format, transports } = winston;

// Define custom logging levels
const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

// Define colors for each log level
winston.addColors({
  fatal: "red",
  error: "red",
  warn: "yellow",
  info: "green",
  debug: "blue",
  trace: "magenta",
});

// Custom log format
const logFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.splat(), // Enables string interpolation and multiple arguments
  format.printf((info) => {
    let message = info.message;
    if (typeof info.message === "object") {
      message = JSON.stringify(info.message, null, 4); // Pretty print objects
    }
    return `[${info.level}] ${info.timestamp} : ${message}`;
  }),
  format.errors({ stack: true }) // To print stack trace for errors
);

// Environment-specific logging
const devTransports = [
  new transports.Console(),
  new transports.File({ filename: "combined-dev.log" }),
];
const prodTransports = [
  new transports.File({ filename: "combined.log", level: "error" }),
  new transports.File({ filename: "error.log", level: "error" }),
];

// Select transports based on the environment
const environmentTransports =
  process.env.NODE_ENV === "production" ? prodTransports : devTransports;

// Create the logger
const logger = winston.createLogger({
  levels: logLevels,
  format: logFormat,
  transports: environmentTransports,
});

module.exports = logger;
