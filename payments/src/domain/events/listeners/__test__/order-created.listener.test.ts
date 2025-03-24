import NatsWrapper from "../../../../libs/nats-wrapper";
import { OrderCreatedListener } from "../order-created.listener";
import { OrderCreatedEvent, OrderStatus } from "@vtex-tickets/common";
import { OrderDocument } from "../../../../domain/models/order.model";
import { orderService } from "../../../../domain/services/order.service";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async (): Promise<{
  listener: OrderCreatedListener;
  msg: Message;
  data: OrderCreatedEvent["payload"];
}> => {
  const listener = new OrderCreatedListener(NatsWrapper.getClient());

  const data: OrderCreatedEvent["payload"] = {
    expiresAt: new Date().toISOString(),
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 20,
    },
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };

  const msg: any = {
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

it("should replicate the order info", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order: OrderDocument = await orderService.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
  expect(order!.userId).toEqual(data.userId);
  expect(order!.status).toEqual(data.status);
});

it("should call the ack function", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
