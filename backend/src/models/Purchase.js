import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true,
    index: true
  },
  purchasedAt: {
    type: Date,
    default: Date.now
  }
});

purchaseSchema.index({ userId: 1, planId: 1 }, { unique: true });

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;
