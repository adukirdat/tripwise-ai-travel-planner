import {
  generateAndSaveTripForUser,
  regenerateAndSaveTripDayForUser
} from "../services/aiTripService.js";

export const generateTrip = async (req, res, next) => {
  try {
    const trip = await generateAndSaveTripForUser(req.user._id, req.body);

    return res.status(201).json({
      message: "AI trip generated successfully.",
      trip
    });
  } catch (error) {
    return next(error);
  }
};

export const regenerateDay = async (req, res, next) => {
  try {
    const trip = await regenerateAndSaveTripDayForUser(req.user._id, req.body);

    return res.status(200).json({
      message: "Itinerary day regenerated successfully.",
      trip
    });
  } catch (error) {
    return next(error);
  }
};
