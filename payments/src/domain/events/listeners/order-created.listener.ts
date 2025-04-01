import {
  BaseListener,
  OrderCreatedEvent,
  Subjects,
} from "@vtex-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { orderService } from "../../../domain/services/order.service";

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly queueGroupName: string = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent["payload"],
    msg: Message
  ): Promise<void> {
    try {
      const order = await orderService.create({
        ...data,
        price: data.ticket.price,
      });

      console.log(`${this.subject} finished successfully!`, order);

      msg.ack();
    } catch (err) {
      console.log(`[${this.subject}] listener failed`, err);
    }
  }
}
