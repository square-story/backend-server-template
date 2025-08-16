import app from "./app";
import { PORT, NODE_ENV } from "./config/env.config";
import { initialConfig } from "./config/initial.config";

const server = app.listen(PORT, async () => {
    await initialConfig();
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌍 Environment: ${NODE_ENV}`);
    console.log(`📊 Health check available at: http://localhost:${PORT}/health`);
});

export default server;
