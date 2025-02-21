import nats, { Message } from "node-nats-streaming";
import { genID } from "./util/id-generator";
import { Subjects } from "./types/subjects.enum";
import { TicketCreatedEvent } from "./types/subjects.interface";

const clientId: string = genID('clientId');

const stan = nats.connect("ticketing", clientId, {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  const subscription = stan.subscribe(Subjects.TicketCreated);
  subscription.on("message", (msg: Message) => {


    const data: TicketCreatedEvent['payload'] = JSON.parse(msg.getData().toString());


    console.log("Message received", data);
  });
});
