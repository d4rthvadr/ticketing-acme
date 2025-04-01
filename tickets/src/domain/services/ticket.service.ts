import { NotFoundError } from "@vtex-tickets/common";
import { Ticket, TicketDocument, TicketModel } from "../../domain/models/ticket.model";

export class TicketService {
  private ticketModel: TicketModel;

  constructor() {
    this.ticketModel = Ticket;
  }

  async list(): Promise<TicketDocument[]> {
    const tickets: TicketDocument[] = await this.ticketModel
      .find({
        orderId: undefined,
      })
      .sort({
        createdAt: -1,
      });

    return tickets;
  }

  /**
   * Finds a ticket by its ID.
   *
   * @param ticketId - The ID of the ticket to find.
   * @returns A promise that resolves to the found ticket document.
   * @throws NotFoundError if the ticket with the specified ID is not found.
   */
  async findById(ticketId: string): Promise<TicketDocument> {
    const ticket: TicketDocument | null = await this.ticketModel.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError(`Ticket with id ${ticketId} not found`);
    }

    return ticket;
  }
}

export const ticketService: TicketService = new TicketService();
