import { Router } from "express";
import { getFeaturedListings, getAllListings } from "../controllers/listingControllers";

const router = Router();

router.get("/featured", getFeaturedListings);
router.get("/", getAllListings);

export default router;