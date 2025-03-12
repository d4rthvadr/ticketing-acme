import { NotFoundError } from "@vtex-tickets/common";
import {
  Ticket,
  TicketDocument,
  TicketModel,
} from "../../domain/models/ticket.model";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";

export class TicketService {
  private ticketModel: TicketModel;

  constructor() {
    this.ticketModel = Ticket;
  }

  /**
   * Finds a ticket by its ID and optionally by its version.
   *
   * @param ticketId - The ID of the ticket to find.
   * @param version - (Optional) The version of the ticket to find. If provided, the function will look for the ticket with the specified version minus one.
   * @returns A promise that resolves to the found ticket document.
   * @throws NotFoundError - If no ticket is found with the given ID (and version, if provided).
   */
  async findTicket(
    ticketId: string,
    version?: number
  ): Promise<TicketDocument> {
    const ticket: TicketDocument | null = await this.ticketModel.findOne({
      _id: ticketId,
      ...(version && { version: version - 1 }), // if version is provided, add it to the query
    });

    if (!ticket) {
      console.error("Ticket not found", {version, ticketId});

      throw new NotFoundError("Ticket not found");
    }

    return ticket;
  }

  /**
   * Creates a new ticket with the provided details.
   *
   * @param {CreateTicketDto} param0 - The data transfer object containing the ticket details.
   * @param {string} param0.id - The unique identifier for the ticket.
   * @param {string} param0.title - The title of the ticket.
   * @param {number} param0.price - The price of the ticket.
   * @returns {Promise<TicketDocument>} - A promise that resolves to the created ticket document.
   */
  async createTicket({
    id,
    title,
    price,
  }: CreateTicketDto): Promise<TicketDocument> {

    try{

      const ticket: TicketDocument = this.ticketModel.build({
        ticketId: id,
        title,
        price,
      });
  
      await ticket.save();
  
      return ticket;
    }catch(err){
      console.error("Error creating ticket", err);
      throw err;
    }
  }

  /**
   * Updates the details of an existing ticket.
   *
   * @param {UpdateTicketDto} param0 - The data transfer object containing the ticket details to be updated.
   * @param {string} param0.id - The unique identifier of the ticket to be updated.
   * @param {string} param0.title - The new title of the ticket.
   * @param {number} param0.price - The new price of the ticket.
   * @returns {Promise<TicketDocument>} - A promise that resolves to the updated ticket document.
   * @throws {Error} - Throws an error if the ticket cannot be found or if the update fails.
   */
  async updateTicket({
    id,
    title,
    price,
    version,
  }: UpdateTicketDto): Promise<TicketDocument> {
    try {
      const ticket: TicketDocument = await this.findTicket(id, version);

      ticket.title = title;
      ticket.price = price;

      await ticket.save();

      return ticket;
    } catch (err) {
      console.error("Error updating ticket", err);
      throw err;
    }
  }
}

export const ticketService = new TicketService();
