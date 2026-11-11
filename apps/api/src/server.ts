import type { Server } from "http";
import { env } from "./config/env.js";
import { connectMongoDB, disconnectMongoDB } from "./config/mongodb.js";
import { logger } from "./utils/logger.js";
import app from "./app.js";

let server: Server | undefined;
let isShuttingDown = false;

const startServer = async (): Promise<void> => {
  try{
    await connectMongoDB();

    server = app.listen(env.PORT, () => {
      logger.info(`Server is running on port ${env.PORT}`);
    });
  }
  catch (error) {
    logger.error("Failed to start the server", {
      error: error instanceof Error ? error.message : String(error),
    });
    await disconnectMongoDB();
    process.exitCode = 1;
  }
}

const shutDown = async (signal: string): Promise<void> => {
  if (isShuttingDown)  return;

  isShuttingDown = true;

  logger.info(`Received ${signal}. Shutting down gracefully...`);

  try{
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server!.close((err) => {
          if (err)  reject(err);
          else  resolve();
        });
      });
    }
    await disconnectMongoDB();
    logger.info("Server shut down gracefully");
    process.exitCode = 0;
  }
  catch (error) {
    logger.error("Error during shutdown", {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exitCode = 1;
  }
}


process.once("SIGTERM", () => shutDown("SIGTERM"));
process.once("SIGINT", () => shutDown("SIGINT"));

void startServer();