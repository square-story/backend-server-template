import connectMongo from "./db.config";

export const initialConfig = async () => {
    try {
        await connectMongo();
    } catch (error) {
        console.error("Error initializing database connection:", error);
        process.exit(1); // Exit the process if database connection fails
    }
}