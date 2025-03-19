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

      console.log(`${this.subject} finished successfully!`, `Order ID: ${orderId}`);

      await expirationQueue.add({
        orderId,
      });

      msg.ack();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
