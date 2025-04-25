import request from "supertest";
import { app } from "../app";
import { setUpEnv } from "./helpers/env";
import { Ticket, TicketDocument } from "../domain/models/ticket.model";
import { Order, OrderDocument } from "../domain/models/order.model";
import { OrderStatus } from "@vtex-tickets/common";
import mongoose from "mongoose";
import NatsWrapper from "../libs/nats-wrapper";

setUpEnv();

const mockUserId = new mongoose.Types.ObjectId().toHexString();

const createOrderHelper = async (
  userId: string,
  status?: OrderStatus,
): Promise<{ ticketId: any; order: OrderDocument }> => {
  // TODO: User orderService.create({..})
  const ticket: TicketDocument = Ticket.build({
    ticketId: new mongoose.Types.ObjectId().toHexString(),
    title: "Sam's concert",
    price: 20,
  });

  await ticket.save();

  const order: OrderDocument = Order.build({
    expiresAt: new Date(),
    status,
    userId,
    ticket,
  });

  await order.save();

  return { order, ticketId: ticket.id };
};

describe("Orders controller", () => {
  let cookie: string[];
  const ticketId: string = new mongoose.Types.ObjectId().toHexString();

  beforeAll(async () => {
    cookie = await global.signin(mockUserId);
  });

  describe("Create order", () => {
    it("should return an error if the ticket does not exits", async () => {
      const response = await request(app).post("/api/orders").set("Cookie", cookie).send({});

      expect(response.status).toEqual(400);
    });

    it("should return an error if ticket is already reserved", async () => {
      const { ticketId } = await createOrderHelper(mockUserId);

      const response = await request(app).post("/api/orders").set("Cookie", cookie).send({
        ticketId,
      });

      expect(response.status).toEqual(400);
    });

    it("should reserve a ticket", async () => {
      const { ticketId } = await createOrderHelper(mockUserId, OrderStatus.Cancelled);

      const response = await request(app).post("/api/orders").set("Cookie", cookie).send({
        ticketId,
      });

      expect(response.status).toEqual(201);
    });
  });

  describe("Get orders", () => {
    it("should a list of orders", async () => {
      const { order } = await createOrderHelper(mockUserId);

      const response = await request(app).get("/api/orders").set("Cookie", cookie).send({});

      expect(response.status).toEqual(200);
      expect(response.body[0].id).toEqual(order.id);
      expect(response.body.length).toEqual(1);
    });
  });

  describe("Get order by id", () => {
    it("should return 404 if order is not found", async () => {
      const response = await request(app)
        .get(`/api/orders/${new mongoose.Types.ObjectId().toHexString()}`)
        .set("Cookie", cookie)
        .send({});

      expect(response.status).toEqual(404);
    });

    it("should return order if found", async () => {
      const { order } = await createOrderHelper(mockUserId);

      const response = await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", cookie)
        .send({});

      expect(response.status).toEqual(200);
      expect(response.body.id).toEqual(order.id);
    });

    it("should return 401 if ticket does not belong to user", async () => {
      const { order } = await createOrderHelper(new mongoose.Types.ObjectId().toHexString());

      const cookie = await global.signin();

      const response = await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", cookie)
        .send({});

      expect(response.status).toEqual(401);
    });
  });

  describe("Cancel order", () => {
    it("should return 404 if order is not found", async () => {
      const response = await request(app)
        .patch(`/api/orders/${new mongoose.Types.ObjectId().toHexString()}/cancel`)
        .set("Cookie", cookie)
        .send({});

      expect(response.status).toEqual(404);
    });

    it("should return 401 if ticket does not belong to user", async () => {
      const { order } = await createOrderHelper(new mongoose.Types.ObjectId().toHexString());

      const cookie = await global.signin();

      const response = await request(app)
        .patch(`/api/orders/${order.id}/cancel`)
        .set("Cookie", cookie)
        .send({});

      expect(response.status).toEqual(401);
    });

    it("should cancel an order", async () => {
      const { order } = await createOrderHelper(mockUserId);

      const cookie = await global.signin(mockUserId);

      const response = await request(app)
        .patch(`/api/orders/${order.id}/cancel`)
        .set("Cookie", cookie)
        .send({});

      expect(response.status).toEqual(204);
    });

    it("should fail to cancel an order", async () => {
      const { order } = await createOrderHelper(mockUserId, OrderStatus.Complete);

      const response = await request(app)
        .patch(`/api/orders/${order.id}/cancel`)
        .set("Cookie", cookie)
        .send({});

      expect(response.status).toEqual(400);
    });
  });
});
