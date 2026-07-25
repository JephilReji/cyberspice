import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { Listing } from "./models/Listing";
import mongoose from "mongoose";

dotenv.config();

const seedListings = [
  {
    title: "Tellicherry Black Pepper",
    grade: "PREMIUM GRADE",
    description:
      "Sourced directly from certified Malabar coast estates with full blockchain traceability.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9dSUkXY09wrMaQHocNLFaucGyQZmRIIofJ_WwZ7VEtCOuFJgAIjRJ6sLxxGfTdA9_t8ABngqSSDuMzCNLnMpNuqWO_zWB8GH5LIKXGvs2t3uJqFvgeeaibd-wcGX142HhsIw-jV2_0uDDKtaQt59ozXLGrRfm5ucMDRBBn6Kd-6NLEjk929tVLMc5kXvZSmU-GBxscy5TSoN5oBOkmbhXcabOISBi0HGkC_QXjLnWmri0XmHvqigh",
    pricePerKg: 12.5,
    origin: "Malabar Coast, India",
    featured: true,
  },
  {
    title: "Ceylon Cinnamon",
    grade: "AUTHENTIC CEYLON",
    description:
      "True cinnamon quills sourced from family-run gardens in Sri Lanka, perfect for global export standards.",
    imageUrl: "https://images.unsplash.com/photo-1614107151491-6876eecbff89?w=1200&q=80",
    pricePerKg: 18.0,
    origin: "Sri Lanka",
    featured: true,
  },
  {
    title: "Kashmiri Saffron",
    grade: "ORGANIC CERTIFIED",
    description:
      "Hand-picked Kashmiri saffron threads, ISO 3632 category 1 grade, known for deep color and aroma.",
    imageUrl: "https://images.unsplash.com/photo-1608797178993-758a2d3d0b83?w=1200&q=80",
    pricePerKg: 2400.0,
    origin: "Kashmir, India",
    featured: true,
  },
];

async function seed() {
  await connectDB();
  await Listing.deleteMany({});
  await Listing.insertMany(seedListings);
  console.log(`Seeded ${seedListings.length} listings.`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});