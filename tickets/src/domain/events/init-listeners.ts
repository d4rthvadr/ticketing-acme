import NatsWrapper from "../../libs/nats-wrapper";
import { OrderCancelledListener } from "./listeners/order-cancelled.listener";
import { OrderCreatedListener } from "./listeners/order-created.listener";


export const initializeEventListeners = () => {

  [
    OrderCancelledListener,
    OrderCreatedListener,
  ].map((listener) => new listener(NatsWrapper.getClient()).listen());

}
