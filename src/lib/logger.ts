import winston, { Logger } from 'winston';
import { format } from 'winston';

const { combine, timestamp, json, errors, colorize, printf } = format;

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  [key: string]: any;
}

// Custom format for development
const devFormat = printf(({ level, message, timestamp, ...metadata }: LogEntry) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

// Create separate formats for production and development
const productionFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

const developmentFormat = combine(
  colorize(),
  timestamp(),
  errors({ stack: true }),
  devFormat
);

// Create the logger instance
const logger: Logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: { service: 'donation-app' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  format: process.env.NODE_ENV === 'production' ? productionFormat : developmentFormat,
  // Handle uncaught exceptions and promises
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ],
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: developmentFormat
  }));
}

// Create a stream object for Morgan integration
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

// Helper functions for structured logging
export const logError = (error: Error, context?: Record<string, unknown>) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    ...context
  });
};

export const logInfo = (message: string, context?: Record<string, unknown>) => {
  logger.info({
    message,
    ...context
  });
};

export const logWarning = (message: string, context?: Record<string, unknown>) => {
  logger.warn({
    message,
    ...context
  });
};

export const logDebug = (message: string, context?: Record<string, unknown>) => {
  logger.debug({
    message,
    ...context
  });
};

export default logger; 