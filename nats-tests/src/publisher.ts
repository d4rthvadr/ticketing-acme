import nats from "node-nats-streaming";
import { genID } from "./util/id-generator";
import { TicketCreatedEvent } from "./types/subjects.interface";
import { Subjects } from "./types/subjects.enum";

const clientId: string = genID('clientId');

// stan is the client that connects to the nats server
const stan = nats.connect("ticketing", clientId, {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const event: TicketCreatedEvent = {
    topic: Subjects.TicketCreated,
    payload: {
      id: "123",
      title: "concert",
      price: 20,
    },
  };

  const eventData = JSON.stringify(event.payload);

  // Publish the data to the channel
  stan.publish(Subjects.TicketCreated, eventData, () => {
    console.log("Event published");
  });
});
