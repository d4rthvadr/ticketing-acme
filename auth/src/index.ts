import { getEnv, validateEnv } from './env';
import { app } from './app';
import { Server } from 'http';
import mongoose from 'mongoose';

const PORT = process.env.NODE_PORT;
process.env.JWT_SECRET = 'SOME_SECRET'; // TODO: pick from env instead
let server: Server | undefined;

/**
 * The timeout duration for the server.
 */
const SERVER_TIME_OUT = 30 * 1000;

/**
 * The possible signals for graceful shutdown.
 */
type Signals =
  | 'uncaughtException'
  | 'unhandledRejection'
  | 'SIGINT'
  | 'SIGTERM';

/**
 * Registers a signal for graceful shutdown.
 * @param signal - The signal to register.
 * @param opts - Additional options for the signal.
 */
const registerSignalGracefulShutdown = (signal: Signals) => {
  // Handle signal
  process.on(signal, async (err) => {
    console.log(`${signal} signal received: closing HTTP server`);
    console.log('peek error', err);
    await handleSignalShutdown();
  });
};

/**
 * Handles the graceful shutdown of the server.
 */
const handleSignalShutdown = async () => {
  if (server) {
    //@ts-ignore
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
registerSignalGracefulShutdown('uncaughtException');
registerSignalGracefulShutdown('unhandledRejection');
registerSignalGracefulShutdown('SIGINT');
registerSignalGracefulShutdown('SIGTERM');

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
  const { DB_MONGO_URL } = getEnv();
  try {
    await connectDB(DB_MONGO_URL);
    server = app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });

    server!.setTimeout(SERVER_TIME_OUT);
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }
};

validateEnv();

onStart();
