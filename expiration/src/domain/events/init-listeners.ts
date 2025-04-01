import NatsWrapper from "../../libs/nats-wrapper";
import { OrderCreatedListener } from "./listeners/order-created.listener";

/**
 * Initializes event listeners for the application.
 *
 * This function creates instances of the event listeners and starts listening
 * for events using the NATS client.
 *
 * The following listeners are initialized:
 * - OrderCreatedListener
 *
 * @returns {void}
 */
export const initializeEventListeners = () => {
  console.log("Initializing event listeners...");
  [OrderCreatedListener].map((listener) => new listener(NatsWrapper.getClient()).listen());
};
