import nats from "node-nats-streaming";
import { Subjects } from "./subjects.enum";
import { TicketCreatedEvent } from "./subjects.interface";

const stan = nats.connect("ticketing", "123", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  const subscription = stan.subscribe(Subjects.TicketCreated);
  subscription.on("message", (msg: TicketCreatedEvent['payload']) => {
    console.log("Message received", msg);
  });
});
