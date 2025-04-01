import { BaseListener, OrderExpiredEvent, Subjects } from "@vtex-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { orderService } from "../../../domain/services/order.service";
import { OrderDocument } from "../../../domain/models/order.model";

export class OrderExpiredListener extends BaseListener<OrderExpiredEvent> {
  readonly subject: Subjects.OrderExpired = Subjects.OrderExpired;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderExpiredEvent["payload"], msg: Message) {
    try {
      const order: OrderDocument = await orderService.cancel(data.id);

      console.log(`${this.subject} finished successfully!`, order);

      msg.ack();
    } catch (err) {
      console.log(`[${this.subject}] listener failed`, err);
    }
  }
}
