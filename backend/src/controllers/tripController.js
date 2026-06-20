import {
  createTripForUser,
  deleteTripForUser,
  getTripForUser,
  getTripsForUser,
  updateTripForUser
} from "../services/tripService.js";

export const getTrips = async (req, res, next) => {
  try {
    const trips = await getTripsForUser(req.user._id);

    return res.status(200).json({
      count: trips.length,
      trips
    });
  } catch (error) {
    return next(error);
  }
};

export const getTripById = async (req, res, next) => {
  try {
    const trip = await getTripForUser(req.user._id, req.params.id);

    return res.status(200).json({ trip });
  } catch (error) {
    return next(error);
  }
};

export const createTrip = async (req, res, next) => {
  try {
    const trip = await createTripForUser(req.user._id, req.body);

    return res.status(201).json({
      message: "Trip created successfully.",
      trip
    });
  } catch (error) {
    return next(error);
  }
};

export const updateTrip = async (req, res, next) => {
  try {
    const trip = await updateTripForUser(req.user._id, req.params.id, req.body);

    return res.status(200).json({
      message: "Trip updated successfully.",
      trip
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    await deleteTripForUser(req.user._id, req.params.id);

    return res.status(200).json({
      message: "Trip deleted successfully."
    });
  } catch (error) {
    return next(error);
  }
};
