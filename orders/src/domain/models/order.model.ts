import mongoose from "mongoose";
import type { OrderAttributes } from '../interfaces/order.interface';
import { OrderStatus } from "@vtex-tickets/common";

export interface OrderDocument extends mongoose.Document, OrderAttributes {
  version?: number;
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
      enum: Object.values(OrderStatus)
    },
    expiresAt: {
      type: Date,
      required: false,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
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

orderSchema.statics.build = (att: OrderAttributes): OrderDocument => {
  return new Order(att);
};

const Order = mongoose.model<OrderDocument, OrderModel>("Order", orderSchema);


export { Order };
