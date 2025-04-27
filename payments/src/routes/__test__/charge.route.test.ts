import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order, OrderDocument } from "../../domain/models/order.model";
import { OrderStatus } from "@vtex-tickets/common";
import { stripe } from "../../libs/stripe";
import Stripe from "stripe";

const createAndSaveOrder = async (
  status = OrderStatus.Created
): Promise<OrderDocument> => {
  const order = Order.build({
    orderId: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status,
    version: 0,
    price: 10,
  });

  return await order.save();
};
it("should return 404 for order not found", async () => {
  await request(app)
    .post(`/api/payments/${new mongoose.Types.ObjectId().toHexString()}/charge`)
    .set("Cookie", global.signin())
    .send({
      token: "tok_visa",
    })
    .expect(404);
});

it("should return 401 if order does not belong to user", async () => {
  const order = await createAndSaveOrder();

  await request(app)
    .post(`/api/payments/${order.id}/charge`)
    .set("Cookie", global.signin())
    .send({
      token: "tok_visa",
    })
    .expect(401);
});

it("should return 400 for already cancelled order", async () => {
  const order = await createAndSaveOrder(OrderStatus.Cancelled);

  const chargeSpy = jest.spyOn(stripe.charges, "create");
  chargeSpy.mockResolvedValue({ id: "123" } as any);

  await request(app)
    .post(`/api/payments/${order.id}/charge`)
    .set("Cookie", global.signin(order.userId))
    .send({
      token: "tok_visa",
    })
    .expect(400);
});

it("should return 201 with valid inputs", async () => {
  const order = await createAndSaveOrder();

  const chargeSpy = jest.spyOn(stripe.charges, "create");
  chargeSpy.mockResolvedValue({ id: "123" } as any);

  await request(app)
    .post(`/api/payments/${order.id}/charge`)
    .set("Cookie", global.signin(order.userId))
    .send({
      token: "tok_visa",
    })
    .expect(201);

  const stripeCharges = await (stripe.charges.create as jest.Mock).mock
    .calls[0][0];
  expect(stripeCharges.source).toEqual("tok_visa");
  expect(stripeCharges.amount).toEqual(order.price * 100);
  expect(stripeCharges.currency).toEqual("usd");
});
