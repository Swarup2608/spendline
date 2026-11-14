
import { Redis } from "ioredis";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,
  retryStrategy(times: number) {
    if (times > 10) {
      logger.error("Redis reconnection attempts exhausted");
      return null;
    }

    return Math.min(times * 500, 5000);
  },
});

redis.on("connect", () => {
  logger.info("Redis connection established");
});

redis.on("ready", () => {
  logger.info("Redis is ready to accept commands");
});

redis.on("error", (error: Error) => {
  logger.error("Redis connection error", {
    error: error.message,
  });
});

redis.on("close", () => {
  logger.warn("Redis connection closed");
});

export const connectRedis = async (): Promise<void> => {
  if (redis.status === "ready") return;

  await redis.connect();
};

export const disconnectRedis = async (): Promise<void> => {
  if (redis.status === "end") return;

  await redis.quit();
};

export const isRedisConnected = (): boolean => {
  return redis.status === "ready";
};
