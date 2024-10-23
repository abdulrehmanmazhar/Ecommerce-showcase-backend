import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    const database = process.env.MONGODB_URI;
    try {
        const connection = await mongoose.connect(`${database}/${DB_NAME}`);
        console.log(`DB is connected on host ${connection.connection.host}`)
    } catch (error) {
        throw error
    }
}

export default connectDB;