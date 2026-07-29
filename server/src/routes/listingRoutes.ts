import { Router } from "express";
import { getFeaturedListings, getAllListings, createListing, getListingById } from "../controllers/listingController";
import { requireAuth } from "../middleware/requireAuth";
import { upload } from "../config/upload";


const router = Router();

router.get("/featured", getFeaturedListings);
router.get("/", getAllListings);
router.get("/:id", getListingById);


router.post(
  "/",
  requireAuth,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "macro", maxCount: 1 },
    { name: "packaging", maxCount: 1 },
    { name: "certification", maxCount: 1 },
  ]),
  createListing
);

export default router;
