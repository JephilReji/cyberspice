import { Router } from "express";
import { getProfile, updateProfile, changePassword, addAddress, deleteAddress } from "../controllers/profileController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.get("/", requireAuth, getProfile);
router.patch("/", requireAuth, updateProfile);
router.patch("/change-password", requireAuth, changePassword);
router.post("/addresses", requireAuth, addAddress);
router.delete("/addresses/:addressId", requireAuth, deleteAddress);

export default router;
