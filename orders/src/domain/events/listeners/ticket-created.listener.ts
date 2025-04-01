import { BaseListener, Subjects, TicketCreatedEvent } from "@vtex-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { ticketService } from "../../../domain/services/ticket.service";

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["payload"], msg: Message) {
    try {
      const ticket = await ticketService.create(data);

      console.log(`${this.subject} finished successfully!`, ticket);

      msg.ack();
    } catch (err) {
      console.log(`[${this.subject}] listener failed`, err);
    }
  }
}
