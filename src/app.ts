import express from "express";
import { connection as mongooseConnection } from "mongoose";
import cors from "cors";
import helmet from "helmet";
import { ALLOWED_ORIGINS, NODE_ENV } from "./config/env.config";

// Import routes
import routes from "./routes";
import { requestLogger, errorLogger } from "./config/logger.config";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: ALLOWED_ORIGINS,
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


if (NODE_ENV === 'development') {
    app.use(requestLogger);
} else {
    // In production, only log critical errors and important requests
    app.use(errorLogger);
    app.use(requestLogger);
}

app.get('/', (req, res) => {
    res.send('Hello World');
});


// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV
    });
});

// Readiness check endpoint
app.get('/ready', (req, res) => {
    // 1 = connected, 2 = connecting, 0 = disconnected, 3 = disconnecting
    const dbState = mongooseConnection.readyState;
    const isReady = dbState === 1;

    const payload = {
        ready: isReady,
        services: {
            database: dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : dbState === 0 ? 'disconnected' : 'disconnecting'
        },
        timestamp: new Date().toISOString(),
        environment: NODE_ENV
    };

    if (isReady) {
        return res.status(200).json(payload);
    }

    return res.status(503).json(payload);
});

app.use('/api', routes);

app.use(notFoundMiddleware);
app.use(errorHandler)

export default app;