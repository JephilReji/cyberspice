import dotenv from "dotenv";
dotenv.config();

import path from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import listingRoutes from "./routes/listingRoutes";
import insightsRoutes from "./routes/insightsRoutes";
import orderRoutes from "./routes/orderRoutes";
import profileRoutes from "./routes/profileRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL]
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many requests. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many OTP requests. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth/send-otp", otpLimiter);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/profile", profileRoutes);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`CyberSpice server running on port ${PORT}`);
  });
}

start();