import mongoose from "mongoose";
import { OrderStatus } from "@vtex-tickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { TicketAttributes } from "./ticket.model";

interface OrderAttributes {
  ticket: TicketAttributes;
  expiresAt: Date;
  status: OrderStatus;
  userId: string;
}

export interface OrderDocument extends mongoose.Document, OrderAttributes {
  version: number;
}

export interface OrderModel extends mongoose.Model<OrderDocument> {
  build(att: OrderAttributes): OrderDocument;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: OrderStatus.Created,
      required: true,
      enum: Object.values(OrderStatus),
    },
    expiresAt: {
      type: Date,
      required: false,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
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
  },
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (att: OrderAttributes): OrderDocument => {
  return new Order(att);
};

const Order = mongoose.model<OrderDocument, OrderModel>("Order", orderSchema);

export { Order };
