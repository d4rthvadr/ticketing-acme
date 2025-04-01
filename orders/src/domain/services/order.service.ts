import { OrderCreatedPublisher } from "../events/publishers/order-created.publisher";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled.publisher";
import { OrderModel, Order, OrderDocument } from "../../domain/models/order.model";
import { TicketDocument } from "../../domain/models/ticket.model";
import NatsWrapper from "../../libs/nats-wrapper";
import { CreateOrderDto } from "./dto/create-order.dto";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@vtex-tickets/common";
import { ticketService } from "./ticket.service";
import { UpdateOrderDto } from "./dto/update-order.dto";

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

export class OrderService {
  private orderModel: OrderModel;

  constructor() {
    this.orderModel = Order;
  }

  /**
   * Creates a new order.
   *
   * @param {CreateOrderDto} createOrderDto - The data transfer object containing the details for the order creation.
   * @returns {Promise<any>} - A promise that resolves to the created order.
   * @throws {BadRequestError} - If the ticket is already reserved.
   *
   */
  async create(createOrderDto: CreateOrderDto): Promise<any> {
    const { userId, ticketId } = createOrderDto;

    // Get associated ticket
    const ticket: TicketDocument = await ticketService.findById(ticketId);

    try {
      const isReserved: boolean = await this.isTicketReserved(ticket);

      if (isReserved) {
        throw new BadRequestError("Ticket is already reserved");
      }

      const expirationTs = new Date();
      expirationTs.setSeconds(expirationTs.getSeconds() + EXPIRATION_WINDOW_SECONDS);

      // Create order with found ticket
      const order: OrderDocument = this.orderModel.build({
        userId,
        status: OrderStatus.Created,
        expiresAt: expirationTs,
        ticket,
      });

      await order.save();

      await new OrderCreatedPublisher(NatsWrapper.getClient()).publish({
        payload: {
          id: order.id,
          status: order.status,
          userId: order.userId,
          expiresAt: order.expiresAt.toISOString(),
          version: order.version,
          ticket: {
            id: ticket._id as string,
            price: ticket.price,
          },
        },
      });

      return order;
    } catch (err) {
      console.error("Error creating order", err);
      throw err;
    }
  }

  /**
   * Checks if a given ticket is reserved by querying the database for an existing order
   * with the specified ticket and a status indicating that the ticket is reserved.
   *
   * @param {TicketDocument} ticket - The ticket to check for reservation.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the ticket is reserved, otherwise `false`.
   */
  private async isTicketReserved(ticket: TicketDocument): Promise<boolean> {
    const existingOrder: OrderDocument | null = await Order.findOne({
      ticket,
      status: {
        $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
      },
    });

    return !!existingOrder;
  }

  /**
   * Finds an order by its ID and validates the resource owner.
   *
   * @param orderId - The ID of the order to find.
   * @param userId - The ID of the user requesting the order.
   * @returns A promise that resolves to the found order document.
   * @throws NotFoundError - If the order is not found.
   */
  async findById(orderId: string, userId?: string): Promise<OrderDocument> {
    const order: OrderDocument | null = await this.orderModel.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (userId) {
      // Validate resource owner
      this.validateResourceOwner(order, userId);
    }

    return order;
  }

  $where: {
    status: OrderStatus.Created;
  };
  async list(userId: string): Promise<OrderDocument[]> {
    const orders: OrderDocument[] = await this.orderModel
      .find({
        userId,
        status: {
          $in: [OrderStatus.Created, OrderStatus.Complete],
        },
      })
      .sort({ createdAt: -1 })
      .populate("ticket");

    return orders;
  }

  /**
   * Updates an existing order with the provided data.
   *
   * @param {UpdateOrderDto} updateOrderData - The data to update the order with.
   * @returns {Promise<OrderDocument>} - A promise that resolves to the updated order document.
   * @throws Will throw an error if the order update fails.
   */
  async update(updateOrderData: UpdateOrderDto): Promise<OrderDocument> {
    try {
      const order: OrderDocument = await this.findById(updateOrderData.orderId);

      order.set({
        status: updateOrderData.status,
      });

      return await order.save();
    } catch (err) {
      console.error("Error updating order", err);
      throw err;
    }
  }

  async cancel(orderId: string, userId?: string): Promise<OrderDocument | undefined> {
    try {
      const order: OrderDocument = await this.findById(orderId, userId);

      if ([OrderStatus.Complete, OrderStatus.Cancelled].includes(order.status)) {
        throw new BadRequestError("Order already cancelled or completed");
      }

      order.status = OrderStatus.Cancelled;
      await order.save();

      // Unreserve the order
      await new OrderCancelledPublisher(NatsWrapper.getClient()).publish({
        payload: {
          id: order.id,
          userId: order.userId,
          ticket: {
            id: order.ticket.ticketId as string,
          },
          version: order.version,
        },
      });

      return order;
    } catch (err) {
      console.error("Error cancelling order", err);
      throw err;
    }
  }

  /**
   * Validates if the provided user is the owner of the resource.
   *
   * @param userId - The ID of the user to validate.
   * @param resource - The resource object containing the userId to compare against.
   * @throws NotAuthorizedError - If the userId does not match the resource's userId.
   */
  private validateResourceOwner(resource: { userId: string }, userId: string) {
    if (resource.userId !== userId) {
      throw new NotAuthorizedError();
    }
  }
}

export const orderService: OrderService = new OrderService();
