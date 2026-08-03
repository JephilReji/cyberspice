import { Router } from "express";
import { createOrder, getMyOrders, getOrderById } from "../controllers/orderController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.post("/", requireAuth, createOrder);
router.get("/my", requireAuth, getMyOrders);
router.get("/:id", requireAuth, getOrderById);

export default router;
