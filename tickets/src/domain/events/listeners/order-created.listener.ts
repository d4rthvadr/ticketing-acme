import { BaseListener, OrderCreatedEvent, Subjects } from "@vtex-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { adminTicketService } from "../../../domain/services/admin.ticket.service";

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent["payload"], msg: Message): Promise<void> {
    try {
      const {
        id,
        ticket: { id: ticketId },
      } = data;

      const reserveTicket = await adminTicketService.reserve(ticketId, id);

      console.log(`${this.subject} finished successfully!`, reserveTicket);

      msg.ack();
    } catch (err) {
      console.log(`[${this.subject}] listener failed`, err);
    }
  }
}
