
import dotenv from "dotenv";
import { z } from "zod";
import { fileURLToPath } from "node:url";

// Load the API's local environment file.
dotenv.config({
  path: fileURLToPath(new URL("../../.env", import.meta.url)),
});

// Define the expected environment variables.
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().positive().default(3000),
  MONGO_URI: z.string().url(),
  REDIS_URL: z.string().url(),
});

// Validate runtime environment variables.
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration:");
  console.error(parsedEnv.error.flatten().fieldErrors);

  process.exit(1);
}

// Export validated configuration.
export const env = parsedEnv.data;
