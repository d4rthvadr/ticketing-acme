import { getEnv, validateEnv } from "./env";
import { Server } from "http";
import NatsWrapper from "./libs/nats-wrapper";
import { randomBytes } from "crypto";
import { initializeEventListeners } from "./domain/events/init-listeners";

const PORT = process.env.NODE_PORT;
process.env.JWT_SECRET = "SOME_SECRET";
let server: Server | undefined;

/**
 * The timeout duration for the server.
 */
const SERVER_TIME_OUT = 30 * 1000;

/**
 * The possible signals for graceful shutdown.
 */
type Signals = "uncaughtException" | "unhandledRejection" | "SIGINT" | "SIGTERM";

/**
 * Registers a signal for graceful shutdown.
 * @param signal - The signal to register.
 * @param opts - Additional options for the signal.
 */
const registerSignalGracefulShutdown = (signal: Signals) => {
  // Handle signal
  process.on(signal, async (err) => {
    console.log(`${signal} signal received: closing HTTP server`, err);
    await handleSignalShutdown();
  });
};

/**
 * Handles the graceful shutdown of the server.
 */
const handleSignalShutdown = async () => {
  await NatsWrapper.disconnect();

  if (server) {
    const serverClosurePromise = new Promise<void>((resolve): void => {
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
      console.log("HTTP server closed");
    });
    await serverClosurePromise;
  }
};

// Register signal handlers for graceful shutdown
registerSignalGracefulShutdown("uncaughtException");
registerSignalGracefulShutdown("unhandledRejection");
registerSignalGracefulShutdown("SIGINT");
registerSignalGracefulShutdown("SIGTERM");

const connectNats = async (clusterId: string, clientId: string, url: string) => {
  await NatsWrapper.connect(clusterId, clientId, url);
  console.log("NATS connection established");
};

/**
 * Starts the server.
 */
const onStart = async () => {
  const { NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL } = getEnv();

  const natsClientId = NATS_CLIENT_ID ?? `client_${randomBytes(4).toString("hex")}`;
  try {
    // Nats connection
    await connectNats(NATS_CLUSTER_ID, natsClientId, NATS_URL);

    // Listen for NATS events
    await initializeEventListeners();
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }
};

validateEnv();

onStart();
