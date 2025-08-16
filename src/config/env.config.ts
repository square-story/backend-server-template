import dotenv from "dotenv";
import path from "path";


const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const PORT = process.env.PORT ?? 8000;
export const NODE_ENV = process.env.NODE_ENV ?? "development";
export const JWT_SECRET = process.env.JWT_SECRET ?? "secret";
export const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/test";
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8000'];

