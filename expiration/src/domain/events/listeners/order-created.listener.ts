import { BaseListener, OrderCreatedEvent, Subjects } from "@vtex-tickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../../queues/expiration.queue";

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["payload"], msg: Message) {
    try {
      const { id: orderId } = data;

      const delay: number = new Date(data.expiresAt).getTime() - new Date().getTime();
      console.log("Expiration delay in ms:", delay);

      await expirationQueue.add(
        {
          orderId,
        },
        {
          delay,
        },
      );

      msg.ack();

      console.log(`${this.subject} finished successfully!`, `Order ID: ${orderId}`);
    } catch (err) {
      console.log(`[${this.subject}] listener failed`, err);
    }
  }
}
