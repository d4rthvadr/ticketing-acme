import NatsWrapper from "../../libs/nats-wrapper";
import { OrderExpiredPublisher } from "../../domain/events/publisher/order-expired.publisher";

export class OrderService {
  constructor() {}

  /**
   * Marks an order as expired and publishes an event to notify that the order has expired.
   *
   * @param {string} orderId - The ID of the order to be marked as expired.
   * @returns {Promise<void>} A promise that resolves when the event has been published.
   */
  async expiredOrder(orderId: string): Promise<void> {
    // Publish an event to notify that the order has expired
    await new OrderExpiredPublisher(NatsWrapper.getClient()).publish({
      payload: {
        id: orderId,
      },
    });
  }
}

export const orderService: OrderService = new OrderService();
