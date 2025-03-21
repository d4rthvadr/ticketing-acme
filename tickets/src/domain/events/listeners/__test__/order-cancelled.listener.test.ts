/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OrderCancelledEvent } from "@vtex-tickets/common";
import NatsWrapper from "../../../../libs/nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled.listener";
import mongoose from "mongoose";
import { ticketService } from "../../../../domain/services/ticket.service";
import { CreateTicketDto } from "../../../../domain/services/dto/create-ticket.dto";
import { Message } from "node-nats-streaming";

const setUp = async (): Promise<{
  listener: OrderCancelledListener;
  msg: Message;
  data: OrderCancelledEvent["payload"];
}> => {
  const ticketData: CreateTicketDto = {
    title: "concert",
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  const ticket = await ticketService.createTicket(ticketData);

  const listener = new OrderCancelledListener(NatsWrapper.getClient());

  const data: OrderCancelledEvent["payload"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: ticket.userId,
    ticket: {
      id: ticket.id,
    },
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

it("should set the orderId to undefined of the ticket", async () => {
  const { listener, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  const ticket = await ticketService.findById(data.ticket.id);

  expect(ticket).toBeDefined();
  expect(ticket.orderId).toBeUndefined();
});

it("should acknowledge the message", async () => {
  const { listener, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

