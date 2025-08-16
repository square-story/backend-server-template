import express from "express";
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


// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV
    });
});

app.use('/api', routes);

app.use(notFoundMiddleware);
app.use(errorHandler)

export default app;