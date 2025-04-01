import mongoose from "mongoose";
import { OrderStatus } from "@vtex-tickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttributes {
  orderId: string;
  status: OrderStatus;
  userId: string;
  price: number;
  version?: number;
}

export interface OrderDocument extends mongoose.Document, OrderAttributes {
  version: number;
  createdAt: Date;
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
    price: {
      type: Number,
      required: true,
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
  }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (att: OrderAttributes): OrderDocument => {
  return new Order({
    _id: att.orderId,
    userId: att.userId,
    status: att.status,
    price: att.price,
  });
};

const Order = mongoose.model<OrderDocument, OrderModel>("Order", orderSchema);

export { Order };
