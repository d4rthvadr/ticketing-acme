import { BaseListener, OrderCancelledEvent, Subjects } from "@vtex-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { adminTicketService } from "../../../domain/services/admin.ticket.service";

export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  readonly queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCancelledEvent["payload"], msg: Message): Promise<void> {
    try {
      const {
        ticket: { id: ticketId },
      } = data;

      console.log(`${this.subject} received!`, data);

      const cancelledTicket = await adminTicketService.cancel(ticketId);

      console.log(`${this.subject} finished successfully!`, cancelledTicket);

      msg.ack();
    } catch (err) {
      console.log(`[${this.subject}] listener failed`, err);
    }
  }
}
