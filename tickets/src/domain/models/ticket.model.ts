import mongoose from "mongoose";
import type { TicketAttributes } from '../interfaces/ticket.interface';

export interface TicketDocument extends mongoose.Document, TicketAttributes {}

export interface TicketModel extends mongoose.Model<TicketDocument> {
  build(att: TicketAttributes): TicketDocument;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    }
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
    strict: true,
  }
);



ticketSchema.statics.build = (att: TicketAttributes) => {
  return new Ticket(att);
};

const Ticket = mongoose.model<TicketDocument, TicketModel>("Ticket", ticketSchema);


export { Ticket };
