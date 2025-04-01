import { TicketCreatedListener } from "./listeners/ticket-created.listener";
import { TicketUpdatedListener } from "./listeners/ticket-updated.listener";
import NatsWrapper from "../../libs/nats-wrapper";
import { OrderExpiredListener } from "./listeners/order-expired.listener";
import { PaymentCreatedListener } from "./listeners/payment-created.listener";

/**
 * Initializes event listeners for the application.
 *
 * This function creates instances of the event listeners and starts listening
 * for events using the NATS client.
 *
 * The following listeners are initialized:
 * - TicketCreatedListener
 * - TicketUpdatedListener
 * - OrderExpiredListener
 * - PaymentCreatedListener
 *
 * @returns {void}
 */
export const initializeEventListeners = () => {
  [TicketCreatedListener, TicketUpdatedListener, OrderExpiredListener, PaymentCreatedListener].map(
    (listener) => new listener(NatsWrapper.getClient()).listen(),
  );
};
