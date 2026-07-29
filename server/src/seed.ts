import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { Listing } from "./models/Listing";
import mongoose from "mongoose";

dotenv.config();

const seedListings = [
  {
    sku: "CS-BP-001",
    title: "Malabar Black Pepper",
    category: "black-pepper",
    grade: "GRADE A",
    description: "Sourced directly from certified Malabar coast estates with full blockchain traceability.",
    harvestDate: "Oct 2023",
    pricePerUnit: 720,
    unit: "Kg",
    totalAvailable: 500,
    packagingType: "Vacuum Sealed Bags",
    images: { cover: "/images/pepper.jpg" },
    origin: "Malabar Coast, India",
    featured: true,
  },
  {
    sku: "CS-CM-042",
    title: "Idukki Cardamom",
    category: "cardamom",
    grade: "GRADE A",
    description: "Premium green cardamom pods from the hills of Idukki, hand-picked for aroma and oil content.",
    harvestDate: "Nov 2023",
    pricePerUnit: 2850,
    unit: "Kg",
    totalAvailable: 200,
    packagingType: "Vacuum Sealed Bags",
    images: {},
    origin: "Idukki, Kerala",
    featured: false,
  } ,
  {
    sku: "CS-TR-015",
    title: "Nizamabad Turmeric",
    category: "turmeric",
    grade: "GRADE A",
    description: "High-curcumin turmeric fingers, sun-dried and polished, from Nizamabad's certified farms.",
    harvestDate: "Sept 2023",
    pricePerUnit: 185,
    unit: "Kg",
    totalAvailable: 1000,
    packagingType: "Gunny Sacks (Bulk)",
    images: {},
    origin: "Nizamabad, Telangana",
    featured: false,
  },
  {
    sku: "CS-CN-008",
    title: "Ceylon Cinnamon",
    category: "cinnamon",
    grade: "GRADE A",
    description: "True cinnamon quills sourced from family-run gardens in Sri Lanka, perfect for global export standards.",
    harvestDate: "Jan 2024",
    pricePerUnit: 1420,
    unit: "Kg",
    totalAvailable: 350,
    packagingType: "Vacuum Sealed Bags",
    images: { cover: "/images/cinnamon.jpg" },
    origin: "Sri Lanka",
    featured: true,
  },
  {
    sku: "CS-SF-099",
    title: "Kashmiri Saffron",
    category: "saffron",
    grade: "GRADE A",
    description: "Hand-picked Kashmiri saffron threads, ISO 3632 category 1 grade, known for deep color and aroma.",
    harvestDate: "Dec 2023",
    pricePerUnit: 320,
    unit: "Gm",
    totalAvailable: 50,
    packagingType: "Retail Glass Jars",
    images: { cover: "/images/saffron.jpg" },
    origin: "Kashmir, India",
    featured: true,
  },
  {
    sku: "CS-CH-033",
    title: "Guntur Chilies",
    category: "chilies",
    grade: "GRADE A",
    description: "Glossy, vibrant red dried chilies known for high pungency, from Guntur's certified growers.",
    harvestDate: "Feb 2024",
    pricePerUnit: 245,
    unit: "Kg",
    totalAvailable: 800,
    packagingType: "Gunny Sacks (Bulk)",
    images: {},
    origin: "Guntur, Andhra Pradesh",
    featured: false,
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
