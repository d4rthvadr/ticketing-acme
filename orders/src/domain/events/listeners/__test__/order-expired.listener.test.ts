import mongoose from "mongoose";
import { ticketService } from "../../../../domain/services/ticket.service";
import NatsWrapper from "../../../../libs/nats-wrapper";
import { OrderExpiredListener } from "../order-expired.listener";
import { Message } from "node-nats-streaming";
import { orderService } from "../../../../domain/services/order.service";
import { OrderExpiredEvent } from "@vtex-tickets/common";

const setup = async (): Promise<{
  listener: OrderExpiredListener;
  msg: Message;
  data: OrderExpiredEvent["payload"];
}> => {
  const listener = new OrderExpiredListener(NatsWrapper.getClient());

  const ticket = await ticketService.create({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  const order = await orderService.create({
    ticketId: ticket.id,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  const data: OrderExpiredEvent["payload"] = {
    id: order.id,
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

it("should update the order status to cancelled", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await orderService.findById(data.id);
  expect(order?.status).toEqual("cancelled");
});

it("should acknowledge the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
