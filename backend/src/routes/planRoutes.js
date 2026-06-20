import express from "express";

import { createPlan, getPlans, purchasePlan } from "../controllers/planController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPlans);
router.post("/", protect, createPlan);
router.post("/:id/purchase", protect, purchasePlan);

export default router;
