import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}

export interface TicketDocument extends mongoose.Document, TicketAttributes {
  version: number;
  orderId?: string;
  createdAt: Date;
}

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
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    strict: true,
    timestamps: true,
  },
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

// ticketSchema.pre("save", function (done) {
//   this.$where = {
//     version: this.get("version") - 1,
//   };
//   done();
// });

ticketSchema.statics.build = (att: TicketAttributes) => {
  return new Ticket(att);
};

const Ticket = mongoose.model<TicketDocument, TicketModel>("Ticket", ticketSchema);

export { Ticket };
