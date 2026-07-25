import { Request, Response } from "express";
import { Listing } from "../models/Listing";

export async function getFeaturedListings(_req: Request, res: Response) {
  try {
    const listings = await Listing.find({ featured: true }).sort({ createdAt: -1 }).limit(6);
    return res.json(listings);
  } catch (err) {
    console.error("Get featured listings error:", err);
    return res.status(500).json({ message: "Could not load featured listings." });
  }
}

export async function getAllListings(_req: Request, res: Response) {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    return res.json(listings);
  } catch (err) {
    console.error("Get listings error:", err);
    return res.status(500).json({ message: "Could not load listings." });
  }
}