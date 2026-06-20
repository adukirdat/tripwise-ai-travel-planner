import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      index: true
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
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
    coverImage: {
      type: String,
      default: ""
    },
    price: {
      type: Number,
      default: 0,
      min: 0
    },
    purchaseCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

const Plan = mongoose.model("Plan", planSchema);

export default Plan;
