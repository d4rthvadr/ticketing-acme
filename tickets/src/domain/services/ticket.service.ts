import { NotAuthorizedError, NotFoundError } from "@vtex-tickets/common";
import { Ticket, TicketDocument, TicketModel } from "../models/ticket.model";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created.publisher";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated.publisher";
import NatsWrapper from "../../libs/nats-wrapper";
export class TicketService {
  private ticketModel: TicketModel;

  constructor() {
    this.ticketModel = Ticket;
  }

  /**
   * Retrieves a list of all tickets from the repository.
   *
   * @returns {Promise<TicketDocument[]>} A promise that resolves to an array of TicketDocument objects.
   */
  async list(): Promise<TicketDocument[]> {
    const tickets: TicketDocument[] = await this.ticketModel.find({});

    return tickets;
  }

  /**
   * Creates a new ticket with the provided details.
   *
   * @param {CreateTicketDto} createTicket - The data transfer object containing the details of the ticket to be created.
   * @returns {Promise<TicketDocument>} A promise that resolves to the created ticket document.
   */
  async createTicket(createTicket: CreateTicketDto): Promise<TicketDocument> {
    try {
      const { title, price, userId } = createTicket;
      const ticket: TicketDocument = this.ticketModel.build({
        title,
        price,
        userId,
      });

      await ticket.save();

      await new TicketCreatedPublisher(NatsWrapper.getClient()).publish({
        payload: {
          id: ticket.id,
          title: ticket.title,
          price: ticket.price,
          userId: ticket.userId,
          version: ticket.version
        },
      });

      return ticket;
    } catch (err) {
      console.log("error creating ticket", err);
      throw err;
    }
  }

  /**
   * Finds a ticket by its ID.
   *
   * @param ticketId - The ID of the ticket to find.
   * @returns A promise that resolves to the found ticket document or null if not found.
   * @throws NotFoundError if the ticket with the specified ID is not found.
   */
  async findById(ticketId: string): Promise<TicketDocument | null> {
    const ticket: TicketDocument | null =
      await this.ticketModel.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError(`Ticket with id ${ticketId} not found`);
    }

    return ticket;
  }

  /**
   * Updates an existing ticket with new details.
   *
   * @param {UpdateTicketDto} updateTicket - The data transfer object containing the updated ticket details.
   * @param {string} updateTicket.title - The new title of the ticket.
   * @param {number} updateTicket.price - The new price of the ticket.
   * @param {string} updateTicket.id - The ID of the ticket to be updated.
   * @param {string} updateTicket.userId - The ID of the user requesting the update.
   *
   * @returns {Promise<TicketDocument>} - A promise that resolves to the updated ticket document.
   *
   * @throws {NotAuthorizedError} - If the user is not authorized to update the ticket.
   */
  async update(updateTicket: UpdateTicketDto): Promise<TicketDocument> {
    const { title, price, id, userId } = updateTicket;

    try {
      const ticket: TicketDocument = await this.findById(id);

      if (!this.isResourceOwner(userId, ticket)) {
        throw new NotAuthorizedError(
          "You are not authorized to update this ticket"
        );
      }

      ticket.set({
        title,
        price,
      });

      await ticket.save();

      await new TicketUpdatedPublisher(NatsWrapper.getClient()).publish({
        payload: {
          id: ticket.id,
          title: ticket.title,
          price: ticket.price,
          userId: ticket.userId,
          version: ticket.version
        },
      });

      return ticket;
    } catch (err) {
      console.log("error updating ticket", err);
      throw err;
    }
  }

  /**
   * Checks if the given user is the owner of the resource.
   *
   * @param userId - The ID of the user to check.
   * @param resource - The resource object containing the user ID.
   * @returns `true` if the user is the owner of the resource, otherwise `false`.
   */
  private isResourceOwner(
    userId: string,
    resource: { userId: string }
  ): boolean {
    return resource.userId === userId;
  }
}

export const ticketService: TicketService = new TicketService();
