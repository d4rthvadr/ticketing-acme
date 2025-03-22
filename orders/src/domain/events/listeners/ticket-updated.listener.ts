import {
  BaseListener,
  Subjects,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from "@vtex-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { ticketService } from "../../../domain/services/ticket.service";

export class TicketUpdatedListener extends BaseListener<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["payload"], msg: Message) {
    console.log("Event data!", data);

    try {
      const updatedTicket = await ticketService.updateTicket(data);

      console.log(`${this.subject} finished successfully!`, updatedTicket);

      msg.ack();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
