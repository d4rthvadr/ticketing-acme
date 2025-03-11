import { TicketDocument } from "domain/models/ticket.model";

export interface CreateOrderDto {
    userId: string;
    ticket: TicketDocument;
}