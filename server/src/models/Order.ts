import { Schema, model, Document, Types } from "mongoose";

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentMethod = "upi" | "card" | "pod";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface IOrderItem {
  listing: Types.ObjectId;
  title: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  subtotal: number;
  imageUrl?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  buyer: Types.ObjectId;
  items: IOrderItem[];
  deliveryAddress: {
    fullName: string;
    company?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  gst: number;
  handlingFee: number;
  grandTotal: number;
  estimatedDelivery: string;
  createdAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
  title: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  pricePerUnit: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  imageUrl: { type: String },
});

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    deliveryAddress: {
      fullName: { type: String, required: true },
      company: { type: String },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: { type: String, enum: ["upi", "card", "pod"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    subtotal: { type: Number, required: true },
    gst: { type: Number, required: true },
    handlingFee: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    estimatedDelivery: { type: String },
  },
  { timestamps: true }
);

export const Order = model<IOrder>("Order", orderSchema);
