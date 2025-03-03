import { OrderStatus } from "@vtex-tickets/common";
import { TicketAttributes } from "./ticket.interface";

export interface OrderAttributes {
    ticketDoc: TicketAttributes;
    expiresAt: Date;
    status: OrderStatus;
    userId: string;
  }
  