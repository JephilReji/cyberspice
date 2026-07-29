import { Schema, model, Document, Types } from "mongoose";

export interface IListing extends Document {
  sku: string; // e.g. "CS-BP-001"
  title: string;
  category: string;
  grade: string;
  description: string;
  harvestDate: string; // e.g. "Oct 2023" — free text to match the seller's input
  pricePerUnit: number;
  unit: "Kg" | "Gm";
  totalAvailable: number;
  maxPurchaseLimit?: number;
  packagingType: string;
  images: {
    cover?: string;
    macro?: string;
    packaging?: string;
    certification?: string;
  };
  origin?: string;
  seller: Types.ObjectId;
  featured: boolean;
  createdAt: Date;
}

const listingSchema = new Schema<IListing>(
  {
    sku: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    grade: { type: String, default: "GRADE A" },
    description: { type: String, required: true },
    harvestDate: { type: String, required: true },
    pricePerUnit: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: ["Kg", "Gm"], default: "Kg" },
    totalAvailable: { type: Number, required: true, min: 0 },
    maxPurchaseLimit: { type: Number },
    packagingType: { type: String, required: true },
    images: {
      cover: { type: String },
      macro: { type: String },
      packaging: { type: String },
      certification: { type: String },
    },
    origin: { type: String, trim: true },
    seller: { type: Schema.Types.ObjectId, ref: "User" },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Listing = model<IListing>("Listing", listingSchema);
