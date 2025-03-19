/**
 * The required environment variables.
 */
const requiredEnvs = ["NATS_CLUSTER_ID", "NATS_URL", "REDIS_HOST"] as const;

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
  NATS_CLUSTER_ID: string;
  NATS_CLIENT_ID: string;
  NATS_URL: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_PASSWORD?: string;
}
export const getEnv = (): Env => {
  return {
    NATS_CLUSTER_ID: process.env.NATS_CLUSTER_ID!,
    NATS_CLIENT_ID: process.env.NATS_CLIENT_ID!,
    NATS_URL: process.env.NATS_URL!,
    REDIS_HOST: process.env.REDIS_HOST!,
    REDIS_PORT: process.env.REDIS_PORT ?? "6379",
    REDIS_PASSWORD: process.env.REDIS_PASSWORD!,
  };
};
