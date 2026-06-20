import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    estimatedCost: {
      type: Number,
      default: 0,
      min: 0
    },
    timeOfDay: {
      type: String,
      default: "",
      trim: true
    }
  },
  { _id: false }
);

const itineraryDaySchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
      min: 1
    },
    activities: {
      type: [activitySchema],
      default: []
    }
  },
  { _id: false }
);

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    tier: {
      type: String,
      default: "",
      trim: true
    },
    estimatedCostNight: {
      type: Number,
      default: 0,
      min: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  { _id: false }
);

const estimatedBudgetSchema = new mongoose.Schema(
  {
    transport: {
      type: Number,
      default: 0,
      min: 0
    },
    accommodation: {
      type: Number,
      default: 0,
      min: 0
    },
    food: {
      type: Number,
      default: 0,
      min: 0
    },
    activities: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { _id: false }
);

const packingItemSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      default: "",
      trim: true
    },
    isPacked: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    destination: {
      type: String,
      required: true,
      trim: true
    },
    durationDays: {
      type: Number,
      required: true,
      min: 1
    },
    budgetTier: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true
    },
    travelerType: {
      type: String,
      enum: ["Solo", "Couple", "Friends", "Family"],
      required: true
    },
    interests: {
      type: [String],
      default: []
    },
    additionalNotes: {
      type: String,
      default: "",
      trim: true
    },
    status: {
      type: String,
      enum: ["draft", "active", "completed"],
      default: "draft"
    },
    itinerary: {
      type: [itineraryDaySchema],
      default: []
    },
    hotels: {
      type: [hotelSchema],
      default: []
    },
    estimatedBudget: {
      type: estimatedBudgetSchema,
      default: () => ({})
    },
    packingList: {
      type: [packingItemSchema],
      default: []
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

tripSchema.index({ userId: 1, status: 1 });
tripSchema.index({ isPublished: 1 });

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
