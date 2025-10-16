import dotenv from "dotenv";
import path from "path";


const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const PORT = process.env.PORT ?? 8000;
export const NODE_ENV = process.env.NODE_ENV ?? "development";
export const JWT_SECRET = process.env.JWT_SECRET ?? "secret";
export const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/test";
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8000'];


export const validateEnv = () => {
    const errors: string[] = [];

    const portNum = Number(PORT);
    if (!Number.isInteger(portNum) || portNum < 1 || portNum > 65535) {
        errors.push(`PORT must be an integer between 1 and 65535. Received: ${PORT}`);
    }

    const allowedEnvs = ["development", "test", "production"];
    if (!allowedEnvs.includes(NODE_ENV)) {
        errors.push(`NODE_ENV must be one of ${allowedEnvs.join(', ')}. Received: ${NODE_ENV}`);
    }

    if (!JWT_SECRET || (NODE_ENV === "production" && JWT_SECRET === "secret")) {
        errors.push("JWT_SECRET must be set and not use the default in production.");
    }

    const isMongoUriValid = typeof MONGO_URI === 'string' && (MONGO_URI.startsWith('mongodb://') || MONGO_URI.startsWith('mongodb+srv://'));
    if (!isMongoUriValid) {
        errors.push("MONGO_URI must start with 'mongodb://' or 'mongodb+srv://'.");
    }

    if (!Array.isArray(ALLOWED_ORIGINS) || ALLOWED_ORIGINS.length === 0) {
        errors.push("ALLOWED_ORIGINS must be a non-empty comma-separated list.");
    } else {
        const invalidOrigins = ALLOWED_ORIGINS.filter(o => !(o.startsWith('http://') || o.startsWith('https://')));
        if (invalidOrigins.length > 0) {
            errors.push(`ALLOWED_ORIGINS contains invalid entries (must start with http/https): ${invalidOrigins.join(', ')}`);
        }
    }

    if (errors.length > 0) {
        const message = `Invalid environment configuration:\n - ${errors.join('\n - ')}`;
        throw new Error(message);
    }
};

