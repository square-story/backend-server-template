import { MONGO_URI } from "./env.config";
import { connect } from "mongoose";

const connectMongo = async () => {
    try {
        await connect(MONGO_URI);
        console.log("🚀 MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    }
};

export default connectMongo;
