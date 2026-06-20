import express from "express";

import {
  createTrip,
  deleteTrip,
  getTripById,
  getTrips,
  updateTrip
} from "../controllers/tripController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getTrips).post(createTrip);
router.route("/:id").get(getTripById).put(updateTrip).delete(deleteTrip);

export default router;
