import { BaseListener, Subjects, PaymentCreatedEvent, OrderStatus } from "@vtex-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { orderService } from "../../../domain/services/order.service";

export class PaymentCreatedListener extends BaseListener<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["payload"], msg: Message) {
    try {
      console.log("PaymentCreatedListener", data);

      const updatedOrder = await orderService.update({
        orderId: data.orderId,
        status: OrderStatus.Complete,
      });

      console.log(`${this.subject} finished successfully!`, updatedOrder);

      msg.ack();
    } catch (err) {
      console.log(`[${this.subject}] listener failed`, err);
    }
  }
}
