import express from "express";

import { generateTrip, regenerateDay } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate-trip", protect, generateTrip);
router.post("/regenerate-day", protect, regenerateDay);

export default router;
