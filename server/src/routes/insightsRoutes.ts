import { Router } from "express";
import { getNews, getMarketData } from "../controllers/insightsController";

const router = Router();

router.get("/news", getNews);
router.get("/market", getMarketData);

export default router;