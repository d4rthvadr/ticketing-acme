import { TicketCreatedListener } from "./listeners/ticket-created.listener";
import { TicketUpdatedListener } from "./listeners/ticket-updated.listener";
import NatsWrapper from "../../libs/nats-wrapper";

/**
 * Initializes event listeners for the application.
 * 
 * This function creates instances of the event listeners and starts listening
 * for events using the NATS client.
 * 
 * The following listeners are initialized:
 * - TicketCreatedListener
 * - TicketUpdatedListener
 * 
 * @returns {void}
 */
export const initializeEventListeners = () => {

  [
    TicketCreatedListener,
    TicketUpdatedListener
  ].map((listener) => new listener(NatsWrapper.getClient()).listen());

}
