import app from "./app";
import { PORT, NODE_ENV, validateEnv } from "./config/env.config";
import { initialConfig } from "./config/initial.config";
import { connection as mongooseConnection } from "mongoose";

const server = app.listen(PORT, async () => {
    // Validate environment before proceeding
    try {
        validateEnv();
    } catch (e) {
        console.error(String(e));
        process.exit(1);
    }
    await initialConfig();
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌍 Environment: ${NODE_ENV}`);
    console.log(`📊 Health check available at: http://localhost:${PORT}/health`);
});

export default server;

// Graceful shutdown handling
const shutdown = (signal: string) => {
    console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

    // Stop accepting new connections
    server.close(async (closeErr?: Error) => {
        if (closeErr) {
            console.error("Error while closing HTTP server:", closeErr);
        }

        try {
            // Close MongoDB connection if open
            if (mongooseConnection.readyState === 1 || mongooseConnection.readyState === 2) {
                await mongooseConnection.close();
                console.log("🛑 MongoDB connection closed");
            }
        } catch (dbErr) {
            console.error("Error while closing MongoDB connection:", dbErr);
        } finally {
            console.log("✅ Graceful shutdown complete. Exiting.");
            process.exit(0);
        }
    });
};

["SIGINT", "SIGTERM"].forEach((sig) => {
    process.on(sig as NodeJS.Signals, () => shutdown(sig));
});
