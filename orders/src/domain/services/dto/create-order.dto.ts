import { TicketDocument } from "domain/models/ticket.model";

export interface CreateOrderDto {
  userId: string;
  ticketId: string;
}
