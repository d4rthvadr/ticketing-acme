import NatsWrapper from "../../../../libs/nats-wrapper";
import { ticketService } from "../../../services/ticket.service";
import { TicketCreatedListener } from "../ticket-created.listener";
import { TicketCreatedEvent } from "@vtex-tickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async (): Promise<{
  listener: TicketCreatedListener;
  msg: Message;
  data: TicketCreatedEvent["payload"];
}> => {
  const listener = new TicketCreatedListener(NatsWrapper.getClient());

  const data: TicketCreatedEvent["payload"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("should create and save a ticket", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();

  const ticket = await ticketService.findTicket(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("should acknowledge the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
