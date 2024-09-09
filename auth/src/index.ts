import { app } from 'app';
import { Server } from 'http';
import mongoose from 'mongoose';

/**
 * The port number on which the server will listen.
 */
const PORT = process.env.NODE_PORT;
let server: Server | undefined;

/**
 * The required environment variables.
 */
const REQUIRED_ENVS = ['NODE_PORT', 'DB_MONGO_URL', 'JWT_SECRET'] as const;

/**
 * The timeout duration for the server.
 */
const TIME_OUT = 6 * 60 * 1000;

/**
 * Validates the presence of required environment variables.
 * Throws an error if any of the required variables are missing.
 */
const validateEnv = () => {
  REQUIRED_ENVS.forEach((env) => {
    if (!process.env[env]) {
      throw new Error(`${env} must be defined`);
    }
  });
};

/**
 * The possible signals for graceful shutdown.
 */
type Signals =
  | 'uncaughtException'
  | 'unhandledRejection'
  | 'SIGNINT'
  | 'SIGNTERM';

/**
 * Registers a signal for graceful shutdown.
 * @param signal - The signal to register.
 * @param opts - Additional options for the signal.
 */
const registerSignalGracefulShutdown = (signal: Signals, opts: {}) => {
  // Handle signal
  process.on(signal, async () => {
    console.log(`${signal} signal received: closing HTTP server`);

    await handleSignalShutdown();
  });
};

/**
 * Handles the graceful shutdown of the server.
 */
const handleSignalShutdown = async () => {
  if (server) {
    const serverClosurePromise = new Promise<void>((resolve, _): void => {
      if (server) {
        server.close((err) => {
          if (err) {
            console.error(err);
            resolve();
          }
          resolve();
        });
      }
    }).then(() => {
      console.log('HTTP server closed');
    });
    await serverClosurePromise;
  }
};

// Register signal handlers for graceful shutdown
registerSignalGracefulShutdown('uncaughtException', {});
registerSignalGracefulShutdown('unhandledRejection', {});
registerSignalGracefulShutdown('SIGNINT', {});
registerSignalGracefulShutdown('SIGNTERM', {});

/**
 * Connects to the MongoDB database.
 * @param mongoDbUrl - The URL of the MongoDB database.
 */
const connectDB = async (mongoDbUrl: string) => {
  await mongoose.connect(mongoDbUrl, {});
  console.log('Mongodb connection established');
};

/**
 * Starts the server.
 */
const onStart = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_KEY must be defined');
  }
  try {
    await connectDB(process.env.DB_MONGO_URL!);
    server = app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });

    server.setTimeout(TIME_OUT);
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }
};

// Validate environment variables
validateEnv();

// Start the server
onStart();
