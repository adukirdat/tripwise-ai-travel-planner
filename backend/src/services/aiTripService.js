import mongoose from "mongoose";

import Trip from "../models/Trip.js";
import { generateStructuredJson } from "./geminiService.js";

const budgetTiers = ["Low", "Medium", "High"];
const travelerTypes = ["Solo", "Couple", "Friends", "Family"];

const tripGenerationSchema = {
  type: "object",
  properties: {
    itinerary: {
      type: "array",
      items: {
        type: "object",
        properties: {
          dayNumber: { type: "integer" },
          activities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                estimatedCost: { type: "number" },
                timeOfDay: { type: "string" }
              },
              required: ["title", "description", "estimatedCost", "timeOfDay"]
            }
          }
        },
        required: ["dayNumber", "activities"]
      }
    },
    hotels: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          tier: { type: "string" },
          estimatedCostNight: { type: "number" },
          rating: { type: "number" }
        },
        required: ["name", "tier", "estimatedCostNight", "rating"]
      }
    },
    estimatedBudget: {
      type: "object",
      properties: {
        transport: { type: "number" },
        accommodation: { type: "number" },
        food: { type: "number" },
        activities: { type: "number" },
        total: { type: "number" }
      },
      required: ["transport", "accommodation", "food", "activities", "total"]
    },
    packingList: {
      type: "array",
      items: {
        type: "object",
        properties: {
          item: { type: "string" },
          category: { type: "string" },
          isPacked: { type: "boolean" }
        },
        required: ["item", "category", "isPacked"]
      }
    }
  },
  required: ["itinerary", "hotels", "estimatedBudget", "packingList"]
};

const replacementDaySchema = {
  type: "object",
  properties: {
    dayNumber: { type: "integer" },
    activities: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          estimatedCost: { type: "number" },
          timeOfDay: { type: "string" }
        },
        required: ["title", "description", "estimatedCost", "timeOfDay"]
      }
    }
  },
  required: ["dayNumber", "activities"]
};

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const replacementDayTopLevelKeys = ["dayNumber", "activities"];

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const isNonNegativeNumber = (value) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

const isValidObjectId = (value) =>
  typeof value === "string" &&
  /^[a-f\d]{24}$/i.test(value) &&
  mongoose.Types.ObjectId.isValid(value);

const toPlainObject = (value) =>
  value && typeof value.toObject === "function" ? value.toObject({ versionKey: false }) : value;

const validateGenerateTripInput = (payload = {}) => {
  const { destination, durationDays, budgetTier, interests, travelerType, additionalNotes } =
    payload;

  if (!isNonEmptyString(destination)) {
    throw createError(400, "Destination is required.");
  }

  if (!Number.isInteger(durationDays) || durationDays < 1) {
    throw createError(400, "durationDays must be a positive integer.");
  }

  if (!budgetTiers.includes(budgetTier)) {
    throw createError(400, "budgetTier must be one of Low, Medium, or High.");
  }

  if (!Array.isArray(interests)) {
    throw createError(400, "interests must be an array of strings.");
  }

  const normalizedInterests = interests
    .filter((interest) => isNonEmptyString(interest))
    .map((interest) => interest.trim());

  const normalizedTravelerType = isNonEmptyString(travelerType) ? travelerType.trim() : "Solo";

  if (!travelerTypes.includes(normalizedTravelerType)) {
    throw createError(400, "travelerType must be one of Solo, Couple, Friends, or Family.");
  }

  return {
    destination: destination.trim(),
    durationDays,
    budgetTier,
    travelerType: normalizedTravelerType,
    interests: normalizedInterests,
    additionalNotes: isNonEmptyString(additionalNotes) ? additionalNotes.trim() : ""
  };
};

const validateRegenerateDayInput = (payload = {}) => {
  const { tripId, dayNumber, instruction } = payload;

  if (!isValidObjectId(tripId)) {
    throw createError(400, "tripId must be a valid ObjectId.");
  }

  if (!Number.isInteger(dayNumber) || dayNumber < 1) {
    throw createError(400, "dayNumber must be a positive integer.");
  }

  if (!isNonEmptyString(instruction)) {
    throw createError(400, "instruction is required.");
  }

  return {
    tripId,
    dayNumber,
    instruction: instruction.trim()
  };
};

const buildTripPrompt = (tripRequest) => `
You are TripWise, an AI travel planner.

Create a practical ${tripRequest.durationDays}-day itinerary for this request:
${JSON.stringify(tripRequest, null, 2)}

Return STRICT JSON only. Do not include markdown, comments, explanations, or code fences.

The JSON must use this exact top-level shape:
{
  "itinerary": [
    {
      "dayNumber": 1,
      "activities": [
        {
          "title": "string",
          "description": "string",
          "estimatedCost": 0,
          "timeOfDay": "Morning"
        }
      ]
    }
  ],
  "hotels": [
    {
      "name": "string",
      "tier": "string",
      "estimatedCostNight": 0,
      "rating": 0
    }
  ],
  "estimatedBudget": {
    "transport": 0,
    "accommodation": 0,
    "food": 0,
    "activities": 0,
    "total": 0
  },
  "packingList": [
    {
      "item": "string",
      "category": "string",
      "isPacked": false
    }
  ]
}

Rules:
- Generate exactly ${tripRequest.durationDays} itinerary days.
- Use numeric costs only, estimated in USD.
- Keep hotel ratings between 0 and 5.
- Set every packingList isPacked value to false.
`;

const buildTripContext = (trip) => {
  const plainTrip = toPlainObject(trip);

  return {
    destination: plainTrip.destination,
    durationDays: plainTrip.durationDays,
    budgetTier: plainTrip.budgetTier,
    travelerType: plainTrip.travelerType,
    interests: plainTrip.interests,
    additionalNotes: plainTrip.additionalNotes,
    status: plainTrip.status,
    itinerary: plainTrip.itinerary,
    hotels: plainTrip.hotels,
    estimatedBudget: plainTrip.estimatedBudget,
    packingList: plainTrip.packingList
  };
};

const buildRegenerateDayPrompt = ({ tripContext, selectedDay, dayNumber, instruction }) => `
You are TripWise, an AI travel planner.

Regenerate only day ${dayNumber} for this existing trip.

User instruction:
${instruction}

Full trip context:
${JSON.stringify(tripContext, null, 2)}

Selected day currently being replaced:
${JSON.stringify(selectedDay, null, 2)}

Return STRICT JSON only. Do not include markdown, comments, explanations, or code fences.

The JSON must be ONLY the replacement day with this exact shape:
{
  "dayNumber": ${dayNumber},
  "activities": [
    {
      "title": "string",
      "description": "string",
      "estimatedCost": 0,
      "timeOfDay": "Morning"
    }
  ]
}

Rules:
- Return only dayNumber ${dayNumber}.
- Preserve the trip destination, budget tier, traveler type, and interests.
- Follow the user instruction while keeping the day realistic for the surrounding itinerary.
- Use numeric costs only, estimated in USD.
- Do not return hotels, budget, packing list, or any other top-level keys.
`;

const validateActivity = (activity) => {
  return (
    isPlainObject(activity) &&
    isNonEmptyString(activity.title) &&
    typeof activity.description === "string" &&
    isNonNegativeNumber(activity.estimatedCost) &&
    typeof activity.timeOfDay === "string"
  );
};

const validateReplacementDay = (replacementDay, dayNumber) => {
  const hasOnlyReplacementDayKeys =
    isPlainObject(replacementDay) &&
    Object.keys(replacementDay).every((key) => replacementDayTopLevelKeys.includes(key));

  const isValid =
    isPlainObject(replacementDay) &&
    hasOnlyReplacementDayKeys &&
    replacementDay.dayNumber === dayNumber &&
    Array.isArray(replacementDay.activities) &&
    replacementDay.activities.length > 0 &&
    replacementDay.activities.every(validateActivity);

  if (!isValid) {
    throw createError(502, "Gemini returned an invalid replacement day. Please try again.");
  }
};

const validateItinerary = (itinerary, durationDays) => {
  if (!Array.isArray(itinerary) || itinerary.length !== durationDays) {
    return false;
  }

  return itinerary.every((day, index) => {
    return (
      isPlainObject(day) &&
      day.dayNumber === index + 1 &&
      Array.isArray(day.activities) &&
      day.activities.length > 0 &&
      day.activities.every(validateActivity)
    );
  });
};

const validateHotels = (hotels) => {
  return (
    Array.isArray(hotels) &&
    hotels.every((hotel) => {
      return (
        isPlainObject(hotel) &&
        isNonEmptyString(hotel.name) &&
        typeof hotel.tier === "string" &&
        isNonNegativeNumber(hotel.estimatedCostNight) &&
        isNonNegativeNumber(hotel.rating) &&
        hotel.rating <= 5
      );
    })
  );
};

const validateEstimatedBudget = (estimatedBudget) => {
  const requiredBudgetFields = ["transport", "accommodation", "food", "activities", "total"];

  return (
    isPlainObject(estimatedBudget) &&
    requiredBudgetFields.every((field) => isNonNegativeNumber(estimatedBudget[field]))
  );
};

const validatePackingList = (packingList) => {
  return (
    Array.isArray(packingList) &&
    packingList.every((packingItem) => {
      return (
        isPlainObject(packingItem) &&
        isNonEmptyString(packingItem.item) &&
        typeof packingItem.category === "string" &&
        typeof packingItem.isPacked === "boolean"
      );
    })
  );
};

const validateGeneratedTripJson = (generatedTrip, durationDays) => {
  const isValid =
    isPlainObject(generatedTrip) &&
    validateItinerary(generatedTrip.itinerary, durationDays) &&
    validateHotels(generatedTrip.hotels) &&
    validateEstimatedBudget(generatedTrip.estimatedBudget) &&
    validatePackingList(generatedTrip.packingList);

  if (!isValid) {
    throw createError(502, "Gemini returned an invalid trip structure. Please try again.");
  }
};

export const generateAndSaveTripForUser = async (userId, payload) => {
  const tripRequest = validateGenerateTripInput(payload);
  const generatedTrip = await generateStructuredJson({
    prompt: buildTripPrompt(tripRequest),
    schema: tripGenerationSchema
  });

  validateGeneratedTripJson(generatedTrip, tripRequest.durationDays);

  return Trip.create({
    userId,
    destination: tripRequest.destination,
    durationDays: tripRequest.durationDays,
    budgetTier: tripRequest.budgetTier,
    travelerType: tripRequest.travelerType,
    interests: tripRequest.interests,
    additionalNotes: tripRequest.additionalNotes,
    status: "draft",
    itinerary: generatedTrip.itinerary,
    hotels: generatedTrip.hotels,
    estimatedBudget: generatedTrip.estimatedBudget,
    packingList: generatedTrip.packingList,
    isPublished: false
  });
};

export const regenerateAndSaveTripDayForUser = async (userId, payload) => {
  const regenerateRequest = validateRegenerateDayInput(payload);
  const trip = await Trip.findOne({ _id: regenerateRequest.tripId, userId });

  if (!trip) {
    throw createError(404, "Trip not found.");
  }

  const selectedDayIndex = trip.itinerary.findIndex(
    (day) => day.dayNumber === regenerateRequest.dayNumber
  );

  if (selectedDayIndex === -1) {
    throw createError(404, "Itinerary day not found.");
  }

  const selectedDay = trip.itinerary[selectedDayIndex];

  const replacementDay = await generateStructuredJson({
    prompt: buildRegenerateDayPrompt({
      tripContext: buildTripContext(trip),
      selectedDay: toPlainObject(selectedDay),
      dayNumber: regenerateRequest.dayNumber,
      instruction: regenerateRequest.instruction
    }),
    schema: replacementDaySchema
  });

  validateReplacementDay(replacementDay, regenerateRequest.dayNumber);

  trip.itinerary = trip.itinerary.map((day, index) =>
    index === selectedDayIndex ? replacementDay : day
  );

  await trip.save();

  return trip;
};
