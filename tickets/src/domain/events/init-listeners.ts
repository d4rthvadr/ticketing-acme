import NatsWrapper from "../../libs/nats-wrapper";
import { OrderCancelledListener } from "./listeners/order-cancelled.listener";
import { OrderCreatedListener } from "./listeners/order-created.listener";

/**
 * Initializes event listeners for the application.
 *
 * This function creates instances of the event listeners and starts listening
 * for events using the NATS client.
 *
 * The following listeners are initialized:
 * - OrderCreatedListener
 * - OrderCancelledListener
 *
 * @returns {void}
 */
export const initializeEventListeners = () => {
  [OrderCancelledListener, OrderCreatedListener].map((listener) =>
    new listener(NatsWrapper.getClient()).listen(),
  );
};
