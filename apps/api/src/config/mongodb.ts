
import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import { env } from "./env.js";

export const connectMongoDB = async (): Promise<void> => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(env.MONGO_URI);

    logger.info("MongoDB connected successfully", {
      database: mongoose.connection.name,
      host: mongoose.connection.host,
    });
  } catch (error) {
    logger.error("MongoDB connection failed", {
      error: error instanceof Error ? error.message : String(error),
    });

    throw error;
  }
};

export const disconnectMongoDB = async (): Promise<void> => {
  await mongoose.disconnect();

  logger.info("MongoDB disconnected successfully");
};

export const isMongoDBConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};