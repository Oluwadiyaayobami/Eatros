const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

// Ensure a user can only review a specific vendor once
reviewSchema.index({ vendorId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
