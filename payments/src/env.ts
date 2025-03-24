import { randomBytes } from "crypto";

/**
 * The required environment variables.
 */
const requiredEnvs = [
  "NODE_PORT",
  "NODE_ENV",
  "DB_MONGO_URL",
  "JWT_SECRET",
  "NATS_CLUSTER_ID",
  "NATS_URL",
  "STRIPE_SECRET",
] as const;

/**
 * Validates the presence of required environment variables.
 * Throws an error if any of the required variables are missing.
 */
export const validateEnv = () => {
  requiredEnvs.forEach((env) => {
    if (!process.env[env]) {
      throw new Error(`${env} must be defined`);
    }
  });
};

interface Env {
  NODE_PORT: string;
  NODE_ENV: string;
  DB_MONGO_URL: string;
  JWT_SECRET: string;
  NATS_CLUSTER_ID: string;
  NATS_CLIENT_ID: string;
  NATS_URL: string;
  STRIPE_SECRET: string;
}

type PartialEnv = Partial<Env>;

export const getEnv = (): Env => {
  return {
    NODE_PORT: process.env.NODE_PORT!,
    NODE_ENV: process.env.NODE_ENV!,
    DB_MONGO_URL: process.env.DB_MONGO_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    NATS_CLUSTER_ID: process.env.NATS_CLUSTER_ID!,
    NATS_CLIENT_ID:
      process.env.NATS_CLIENT_ID ?? `client_${randomBytes(4).toString("hex")}`,
    NATS_URL: process.env.NATS_URL!,
    STRIPE_SECRET: process.env.STRIPE_SECRET!,
  };
};
