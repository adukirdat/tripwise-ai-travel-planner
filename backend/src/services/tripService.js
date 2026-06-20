import mongoose from "mongoose";

import Trip from "../models/Trip.js";

const editableTripFields = [
  "destination",
  "durationDays",
  "budgetTier",
  "travelerType",
  "interests",
  "additionalNotes",
  "status",
  "itinerary",
  "hotels",
  "estimatedBudget",
  "packingList",
  "isPublished"
];

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const isValidObjectId = (value) =>
  typeof value === "string" &&
  /^[a-f\d]{24}$/i.test(value) &&
  mongoose.Types.ObjectId.isValid(value);

const assertValidObjectId = (id, fieldName = "Trip id") => {
  if (!isValidObjectId(id)) {
    throw createError(400, `${fieldName} must be a valid ObjectId.`);
  }
};

const pickTripFields = (payload) =>
  editableTripFields.reduce((tripData, field) => {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      tripData[field] = payload[field];
    }

    return tripData;
  }, {});

const assertHasWritableFields = (payload) => {
  if (Object.keys(payload).length === 0) {
    throw createError(400, "Provide at least one supported trip field.");
  }
};

export const createTripForUser = async (userId, payload) => {
  const tripData = pickTripFields(payload);
  assertHasWritableFields(tripData);

  return Trip.create({
    ...tripData,
    userId
  });
};

export const getTripsForUser = async (userId) => {
  return Trip.find({ userId }).sort({ createdAt: -1 });
};

export const getTripForUser = async (userId, tripId) => {
  assertValidObjectId(tripId);

  const trip = await Trip.findOne({ _id: tripId, userId });

  if (!trip) {
    throw createError(404, "Trip not found.");
  }

  return trip;
};

export const updateTripForUser = async (userId, tripId, payload) => {
  assertValidObjectId(tripId);

  const tripData = pickTripFields(payload);
  assertHasWritableFields(tripData);

  const trip = await Trip.findOneAndUpdate({ _id: tripId, userId }, tripData, {
    new: true,
    runValidators: true
  });

  if (!trip) {
    throw createError(404, "Trip not found.");
  }

  return trip;
};

export const deleteTripForUser = async (userId, tripId) => {
  assertValidObjectId(tripId);

  const trip = await Trip.findOneAndDelete({ _id: tripId, userId });

  if (!trip) {
    throw createError(404, "Trip not found.");
  }

  return trip;
};
