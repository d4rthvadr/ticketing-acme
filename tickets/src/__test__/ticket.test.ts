import request from "supertest";
import { app } from "../app";
import { setUpEnv } from "./helpers/env";
import { Ticket } from "../domain/models/ticket.model";
import mongoose from "mongoose";
import NatsWrapper from "../../src/libs/nats-wrapper";

setUpEnv();

const createTicketHelper = async (title: string, price: number, cookie: string[]) => {
  // create a ticket
  return await request(app).post("/api/tickets/admin").set("Cookie", cookie).send({
    title,
    price,
  });
};

describe("Tickets controller", () => {
  const title: string = "concert";
  const price: number = 20;
  const ticketId: string = new mongoose.Types.ObjectId().toHexString();
  let cookie: string[];

  beforeAll(async () => {
    cookie = await global.signin();
  });

  describe("Create tickets", () => {
    it("should have a handler listening to /api/tickets/admin for post requests", async () => {
      const response = await request(app).post("/api/tickets/admin").send({});
      expect(response.status).not.toEqual(404);
    });

    it("should return 401 if user is not signed in", async () => {
      await request(app).post("/api/tickets/admin").send({}).expect(401);
    });

    it("should not return 401 if user is signed in", async () => {
      const response = await request(app).post("/api/tickets/admin").set("Cookie", cookie).send({});
      expect(response.status).not.toEqual(401);
    });

    it("should return an error if an invalid title is provided", async () => {
      const response = await request(app)
        .post("/api/tickets/admin")
        .set("Cookie", cookie)
        .send({ tile: "" });
      expect(response.status).toEqual(400);
    });

    it("should return an error if an invalid price is provided", async () => {
      await request(app)
        .post("/api/tickets/admin")
        .send({ price: 200 })
        .set("Cookie", cookie)
        .expect(400);
    });

    it("should create a ticket with valid inputs", async () => {
      let tickets = await Ticket.find({});
      expect(tickets.length).toEqual(0);

      await request(app)
        .post("/api/tickets/admin")
        .set("Cookie", cookie)
        .send({
          title,
          price,
        })
        .expect(201);

      tickets = await Ticket.find({});
      expect(tickets[0].price).toEqual(price);
      expect(tickets[0].title).toEqual(title);
    });
  });

  describe("Find tickets", () => {
    it.skip("should return 404 if ticket is not found", async () => {
      const response = await request(app)
        .get(`/api/tickets/admin/${ticketId}`)
        .set("Cookie", cookie)
        .send({});

      expect(response.status).toEqual(404);
    });
    it("should return ticket if found", async () => {
      // create a ticket
      let response = await createTicketHelper(title, price, cookie);

      response = await request(app)
        .get(`/api/tickets/admin/${response.body.id}`)
        .set("Cookie", cookie)
        .send({});
      expect(response.status).toEqual(200);
      expect(response.body.title).toEqual(title);
      expect(response.body.price).toEqual(price);
    });
  });

  describe("Get all tickets", () => {
    it("should return all tickets", async () => {
      // create a ticket
      await createTicketHelper(title, price, cookie);

      const response = await request(app).get(`/api/tickets/admin`).set("Cookie", cookie).send({});

      expect(response.status).toEqual(200);
      expect(response.body.length).toEqual(1);
    });
  });

  describe("Update tickets", () => {
    it("should return a 404 if ticket not found", async () => {
      // create a ticket
      await createTicketHelper(title, price, cookie);

      const response = await request(app)
        .put(`/api/tickets/admin/${ticketId}`)
        .set("Cookie", cookie)
        .send({
          title,
          price,
        });

      expect(response.status).toEqual(200);
      expect(response.body.length).toEqual(1);
    });

    it("should return a 401 if user is not signed in", async () => {
      // create a ticket
      await createTicketHelper(title, price, cookie);

      const response = await request(app).put(`/api/tickets/admin/${ticketId}`).send({});

      expect(response.status).toEqual(401);
    });

    it("should return a 401 if user does not own the ticket", async () => {
      // create a ticket
      const response = await createTicketHelper(title, price, cookie);

      const newCookie = await global.signin(crypto.randomUUID());

      await request(app)
        .put(`/api/tickets/admin/${response.body.id}`)
        .set("Cookie", newCookie)
        .send({
          title: "new title",
          price: 100,
        })
        .expect(401);
    });

    it.skip("should publish an event", async () => {
      // create a ticket
      const response = await createTicketHelper(title, price, cookie);

      await request(app)
        .put(`/api/tickets/admin/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
          title: "new title",
          price: 100,
        })
        .expect(201);

      expect(NatsWrapper.getClient().publish).toHaveBeenCalled();
    });
    // it("should reject updates if the ticket is reserved", async () => {
    //   // create a ticket
    //   let response = await createTicketHelper(title, price, cookie);

    //   const ticket = await Ticket.findById(response.body.id);

    //   ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    //   await ticket!.save();

    //   response = await request(app)
    //     .put(`/api/tickets/admin${response.body.id}`)
    //     .set("Cookie", cookie)
    //     .send({
    //       title: "new title",
    //       price: 100,
    //     });

    //   expect(response.status).toEqual(400);
    // });
  });
});
