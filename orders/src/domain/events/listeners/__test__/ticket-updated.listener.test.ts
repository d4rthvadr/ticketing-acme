import NatsWrapper from "../../../../libs/nats-wrapper";
import { ticketService } from "../../../services/ticket.service";
import { TicketUpdatedEvent } from "@vtex-tickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketUpdatedListener } from "../ticket-updated.listener";

const setup = async (): Promise<{
  listener: TicketUpdatedListener;
  msg: Message;
  data: TicketUpdatedEvent["payload"];
}> => {
  const listener = new TicketUpdatedListener(NatsWrapper.getClient());

  const ticket = await ticketService.create({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  const data: TicketUpdatedEvent["payload"] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: ticket.title,
    price: 30,
    userId: new mongoose.Types.ObjectId().toHexString(),
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

it("should create and update a ticket", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const ticket = await ticketService.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
  expect(ticket!.version).toEqual(data.version);
});

it("should acknowledge the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("should not call ack if the event has a skipped version number", async () => {
  const { listener, data, msg } = await setup();

  data.version = 12;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
