import { PaymentProvider } from "../../domain/enums/payment-providers.enum";
import mongoose from "mongoose";

interface PaymentAttributes {
  orderId: string;
  paymentRefId: string;
  paymentProvider: string;
}

export interface PaymentDocument extends mongoose.Document, PaymentAttributes {
  version: number;
}

export interface OrderModel extends mongoose.Model<PaymentDocument> {
  build(att: PaymentAttributes): PaymentDocument;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    paymentRefId: {
      type: String,
      required: true,
    },
    paymentProvider: {
      type: String,
      required: true,
      enum: Object.values(PaymentProvider),
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
  }
);

paymentSchema.statics.build = (att: PaymentAttributes): PaymentDocument => {
  return new Payment(att);
};

const Payment = mongoose.model<PaymentDocument, OrderModel>(
  "Payment",
  paymentSchema
);

export { Payment };
