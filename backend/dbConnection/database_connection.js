import mongoose from "mongoose";
import dotenv from 'dotenv';
import { ApiError } from "../utils/ApiError.js";

dotenv.config({});

const connectionDataBase = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new ApiError(500, "MONGODB_URI is not defined in environment variables!");
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("MongoDB Connection Successful");
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

export { connectionDataBase };
