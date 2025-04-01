import { stripe } from "../../libs/stripe";
import {
  OrderModel,
  Order,
  OrderDocument,
} from "../../domain/models/order.model";
import { CancelOrderDto } from "./dto/cancel-order.dto";
import { ChargeOrderDto } from "./dto/charge-order.dto";
import { CreateOrderDto } from "./dto/create-order.dto";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@vtex-tickets/common";
import { convertToCents, Currencies } from "./utils/currency-conversion";
import { Payment, PaymentDocument } from "../../domain/models/payment.model";
import { PaymentProvider } from "../../domain/enums/payment-providers.enum";
import { PaymentCreatedPublisher } from "../../domain/events/publishers/payment-created.publisher";
import NatsWrapper from "../../libs/nats-wrapper";

export class OrderService {
  private orderModel: OrderModel;

  constructor() {
    this.orderModel = Order;
  }

  /**
   * Creates a new order.
   *
   * @param {CreateOrderDto} createOrderDto - The data transfer object containing the details for the order creation.
   * @returns {Promise<OrderDocument>} - A promise that resolves to the created order.
   * @throws {BadRequestError} - If the ticket is already reserved.
   *
   */
  async create(createOrderDto: CreateOrderDto): Promise<OrderDocument> {
    const { id: orderId, userId, status, price, version } = createOrderDto;

    try {
      const order: OrderDocument = this.orderModel.build({
        orderId,
        userId,
        status,
        price,
        version,
      });

      await order.save();

      console.log("Order created successfully", order);

      return order;
    } catch (err) {
      console.error("Error creating order", err);
      throw err;
    }
  }

  /**
   * Finds an order by its ID.
   *
   * @param {string} orderId - The ID of the order to find.
   * @returns {Promise<OrderDocument>} A promise that resolves to the found order document.
   * @throws {NotFoundError} If the order with the specified ID is not found.
   */
  async findById(orderId: string, version?: number): Promise<OrderDocument> {
    const order: OrderDocument | null = await this.orderModel.findOne({
      _id: orderId,
      ...(version && { version: version - 1 }), // if version is provided, add it to the query
    });
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    return order;
  }

  /**
   * Cancels an order.
   *
   * @param {CancelOrderDto} cancelOrderData - The data transfer object containing the details for cancelling the order.
   * @returns {Promise<OrderDocument>} - A promise that resolves to the cancelled order.
   * @throws {BadRequestError} - If the order is already cancelled.
   * @throws {NotAuthorizedError} - If the user is not authorized to cancel the order.
   */
  async cancelOrder(cancelOrderData: CancelOrderDto): Promise<OrderDocument> {
    try {
      const { id: orderId, userId, version } = cancelOrderData;
      const order: OrderDocument = await this.findById(orderId, version);

      if (userId) {
        this.validateResourceOwner(order, userId);
      }

      if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError("Order already cancelled");
      }

      order.set({ status: OrderStatus.Cancelled });
      await order.save();

      return order;
    } catch (err) {
      console.error("Error cancelling order", err);
      throw err;
    }
  }

  async charge(dataDto: ChargeOrderDto): Promise<PaymentDocument> {
    try {
      const { orderId, userId, token } = dataDto;
      const order: OrderDocument = await this.findById(orderId);

      this.validateResourceOwner(order, userId);

      if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError("Cannot pay for a cancelled order.");
      }

      if (order.status === OrderStatus.Complete) {
        throw new BadRequestError("Order already completed.");
      }

      const stripeResult = await stripe.charges.create({
        amount: convertToCents(order.price),
        currency: Currencies.USD,
        source: token,
        description: `Charge for order ${orderId}`,
      });

      const payment = Payment.build({
        orderId: order.id,
        paymentRefId: stripeResult.id,
        paymentProvider: PaymentProvider.Stripe,
      });

      await payment.save();

      await new PaymentCreatedPublisher(NatsWrapper.getClient()).publish({
        payload: {
          id: payment.id,
          orderId: payment.orderId,
          paymentRefId: payment.paymentRefId,
          paymentProvider: payment.paymentProvider,
        },
      });

      console.log("Stripe charge result", stripeResult);

      return payment;
    } catch (err) {
      console.error("Error charging order", err);
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
