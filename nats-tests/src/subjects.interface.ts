import { Subjects } from "./subjects.enum";

export interface TicketCreatedEvent {
  topic: Subjects;
  payload: {
    id: string;
    title: string;
    price: number;
    userId?: string;
  };
}
