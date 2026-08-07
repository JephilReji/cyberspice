import { Response } from "express";
import { Listing } from "../models/Listing";
import { AuthRequest } from "../middleware/requireAuth";

export async function getFeaturedListings(_req: AuthRequest, res: Response) {
  try {
    const listings = await Listing.find({ featured: true }).sort({ createdAt: -1 }).limit(6);
    return res.json(listings);
  } catch (err) {
    console.error("Get featured listings error:", err);
    return res.status(500).json({ message: "Could not load featured listings." });
  }
}

export async function getAllListings(req: AuthRequest, res: Response) {
  try {
    const { search } = req.query;
    const filter = search
      ? {
          $or: [
            { title: { $regex: search as string, $options: "i" } },
            { category: { $regex: search as string, $options: "i" } },
            { origin: { $regex: search as string, $options: "i" } },
            { description: { $regex: search as string, $options: "i" } },
          ],
        }
      : {};
    const listings = await Listing.find(filter).sort({ createdAt: -1 });
    return res.json(listings);
  } catch (err) {
    console.error("Get listings error:", err);
    return res.status(500).json({ message: "Could not load listings." });
  }
}

export async function getListingById(req: AuthRequest, res: Response) {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found." });
    return res.json(listing);
  } catch (err) {
    console.error("Get listing error:", err);
    return res.status(500).json({ message: "Could not load listing." });
  }
}

function generateSku(category: string) {
  const prefix = category.slice(0, 2).toUpperCase();
  const random = Math.floor(100 + Math.random() * 900);
  return `CS-${prefix}-${random}`;
}

export async function createListing(req: AuthRequest, res: Response) {
  try {
    const { title, category, description, harvestDate, pricePerUnit, unit, totalAvailable, maxPurchaseLimit, packagingType, origin } = req.body;

    if (!title || !category || !description || !harvestDate || !pricePerUnit || !totalAvailable || !packagingType) {
      return res.status(400).json({ message: "Missing required listing fields." });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    function fileUrl(fieldname: string): string | undefined {
      const file = files?.[fieldname]?.[0];
      return file ? `/uploads/${file.filename}` : undefined;
    }

    const listing = await Listing.create({
      sku: generateSku(category),
      title, category, description, harvestDate,
      pricePerUnit: Number(pricePerUnit),
      unit: unit === "Gm" ? "Gm" : "Kg",
      totalAvailable: Number(totalAvailable),
      maxPurchaseLimit: maxPurchaseLimit ? Number(maxPurchaseLimit) : undefined,
      packagingType, origin,
      seller: req.userId,
      images: {
        cover: fileUrl("cover"),
        macro: fileUrl("macro"),
        packaging: fileUrl("packaging"),
        certification: fileUrl("certification"),
      },
    });

    return res.status(201).json(listing);
  } catch (err) {
    console.error("Create listing error:", err);
    return res.status(500).json({ message: "Could not create listing." });
  }
}