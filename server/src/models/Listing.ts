import { Schema, model, Document, Types } from "mongoose";

export interface IListing extends Document {
  title: string;
  grade: string; // e.g. "PREMIUM GRADE", "AUTHENTIC CEYLON"
  description: string;
  imageUrl: string;
  pricePerKg: number;
  origin: string;
  seller: Types.ObjectId;
  featured: boolean;
  createdAt: Date;
}

const listingSchema = new Schema<IListing>(
  {
    title: { type: String, required: true, trim: true },
    grade: { type: String, trim: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    pricePerKg: { type: Number, required: true, min: 0 },
    origin: { type: String, trim: true },
    seller: { type: Schema.Types.ObjectId, ref: "User" },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Listing = model<IListing>("Listing", listingSchema);