/**
 * The required environment variables.
 */
const requiredEnvs = [
  "NODE_PORT",
  "DB_MONGO_URL",
  "JWT_SECRET",
  "NATS_CLUSTER_ID",
  "NATS_URL",
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
  DB_MONGO_URL: string;
  JWT_SECRET: string;
  NATS_CLUSTER_ID: string;
  NATS_CLIENT_ID: string;
  NATS_URL: string;
}
export const getEnv = (): Env => {
  return {
    NODE_PORT: process.env.NODE_PORT!,
    DB_MONGO_URL: process.env.DB_MONGO_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    NATS_CLUSTER_ID: process.env.NATS_CLUSTER_ID!,
    NATS_CLIENT_ID: process.env.NATS_CLIENT_ID!,
    NATS_URL: process.env.NATS_URL!,
  };
};
