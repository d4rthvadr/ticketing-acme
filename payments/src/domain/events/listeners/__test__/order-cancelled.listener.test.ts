import NatsWrapper from "../../../../libs/nats-wrapper";
import { OrderCancelledEvent, OrderStatus } from "@vtex-tickets/common";
import { OrderDocument } from "../../../../domain/models/order.model";
import { orderService } from "../../../../domain/services/order.service";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../order-cancelled.listener";

const setup = async (): Promise<{
  listener: OrderCancelledListener;
  msg: Message;
  data: OrderCancelledEvent["payload"];
}> => {
  const listener = new OrderCancelledListener(NatsWrapper.getClient());

  const orderCancelled: OrderCancelledEvent["payload"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };

  await orderService.cancelOrder({
    id: orderCancelled.id,
    userId: orderCancelled.userId,
    version: orderCancelled.version,
  });

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

  return { listener, data: orderCancelled, msg };
};

it("should replicate the order info", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order: OrderDocument = await orderService.findById(data.id);

  expect(order.status).toEqual(OrderStatus.Cancelled);
  expect(order.id).toEqual(data.id);
  expect(order.userId).toEqual(data.userId);
});

it("should call the ack function", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
