import mongoose from 'mongoose';

let isConnected = false; // track the connection

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log('MongoDB is already connected');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "share_prompt",
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        })

        isConnected = true;

        console.log('MongoDB connected')
    } catch (error) {
        console.log("MongoDB connection error: ", error);
        throw error;
    }
}