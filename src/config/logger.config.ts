import morgan from "morgan";
import { Request, Response } from 'express';

// Only log body in development to avoid performance issues
const shouldLogBody = process.env.NODE_ENV === 'development';

// Custom token for body logging with size limit
morgan.token('body', (req: Request) => {
    if (!shouldLogBody) return '';

    const body = req.body;
    if (!body || Object.keys(body).length === 0) return '';

    // Limit body size to prevent memory issues
    const bodyStr = JSON.stringify(body);
    return bodyStr.length > 500 ? bodyStr.substring(0, 500) + '...' : bodyStr;
});

// Optimized format that only includes body in development
const logFormat = shouldLogBody
    ? ':method :url :status :response-time ms - :res[content-length] :body'
    : ':method :url :status :response-time ms - :res[content-length]';

// Single optimized logger
export const requestLogger = morgan(logFormat, {
    // Skip health checks and static files in production
    skip: (req: Request, res: Response) => {
        if (process.env.NODE_ENV === 'production') {
            return req.path === '/health' || req.path.startsWith('/static');
        }
        return false;
    },
    stream: {
        write: (message: string) => {
            const trimmedMessage = message.trim();
            const statusCode = parseInt(trimmedMessage.split(' ')[2]);

            // Color code based on status
            if (statusCode >= 400) {
                console.error('\x1b[31m%s\x1b[0m', trimmedMessage); // Red for errors
            } else if (statusCode >= 300) {
                console.warn('\x1b[33m%s\x1b[0m', trimmedMessage);  // Yellow for redirects
            } else {
                console.log('\x1b[32m%s\x1b[0m', trimmedMessage);   // Green for success
            }
        },
    },
});

// Separate error logger for critical errors only
export const errorLogger = morgan('combined', {
    skip: (req: Request, res: Response) => res.statusCode < 500, // Only log 5xx errors
    stream: {
        write: (message: string) => console.error('\x1b[31m[CRITICAL ERROR] %s\x1b[0m', message.trim()),
    },
});

// Legacy exports for backward compatibility
export const developmentLogger = requestLogger;



