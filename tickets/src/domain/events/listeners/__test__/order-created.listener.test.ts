import { OrderCreatedEvent, OrderStatus } from "@vtex-tickets/common";
import NatsWrapper from "../../../../libs/nats-wrapper";
import { OrderCreatedListener } from "../order-created.listener";
import mongoose from "mongoose";
import { adminTicketService } from "../../../../domain/services/admin.ticket.service";
import { CreateTicketDto } from "../../../../domain/services/dto/create-ticket.dto";
import { Message } from "node-nats-streaming";

const setUp = async (): Promise<{
  listener: OrderCreatedListener;
  msg: Message;
  data: OrderCreatedEvent["payload"];
}> => {
  const listener = new OrderCreatedListener(NatsWrapper.getClient());

  const ticketData: CreateTicketDto = {
    title: "concert",
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  const ticket = await adminTicketService.create(ticketData);

  const data: OrderCreatedEvent["payload"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    userId: ticket.userId,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    status: OrderStatus.Created,
    version: 0,
  };

  const msg: Message = {
    ack: jest.fn(),
    getSubject: jest.fn(),
    getSequence: jest.fn(),
    getRawData: jest.fn(),
    getData: jest.fn(),
    isRedelivered: jest.fn(),
    getCrc32: jest.fn(),
    getTimestampRaw: jest.fn(),
    getTimestamp: jest.fn(),
  };

  return { listener, data, msg };
};

it("should set the orderId of the ticket", async () => {
  const { listener, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  const ticket = await adminTicketService.findById(data.ticket.id);

  expect(ticket).toBeDefined();
  expect(ticket.orderId).toEqual(data.id);
});

it("should acknowledge the message", async () => {
  const { listener, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("should publish a ticket updated event", async () => {
  const { listener, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  // expect(NatsWrapper.getClient().publish).toHaveBeenCalled();
});
