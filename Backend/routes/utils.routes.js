import { Router } from "express";
import { getNews, getHealthTips,chatbot } from "../controllers/utils.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = Router();

router.get("/news", getNews);
router.get("/health-tip", getHealthTips);
router.post("/chat", authMiddleware, chatbot);
export default router;

