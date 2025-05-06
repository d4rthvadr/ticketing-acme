import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
export interface TicketAttributes {
  ticketId: string;
  title: string;
  price: number;
}

export interface TicketDocument extends mongoose.Document, TicketAttributes {
  _id: string;
  version: number;
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
      min: 0,
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
//
// ticketSchema.pre("save", function (done) {
//   this.$where = {
//     version: this.get("version") - 1,
//   };
//   done();
// });

ticketSchema.statics.build = (att: TicketAttributes): TicketDocument => {
  return new Ticket({
    _id: att.ticketId,
    title: att.title,
    price: att.price,
  });
};

const Ticket = mongoose.model<TicketDocument, TicketModel>("Ticket", ticketSchema);

export { Ticket };
