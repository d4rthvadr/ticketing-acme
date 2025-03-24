import {
  BaseListener,
  OrderCancelledEvent,
  OrderCreatedEvent,
  Subjects,
} from "@vtex-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { orderService } from "../../../domain/services/order.service";

export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  readonly queueGroupName: string = queueGroupName;

  async onMessage(
    data: OrderCancelledEvent["payload"],
    msg: Message
  ): Promise<void> {
    try {
      const order = await orderService.cancelOrder({
        id: data.id,
        userId: data.userId,
        version: data.version,
      });

      console.log(`${this.subject} finished successfully!`, order);

      msg.ack();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
