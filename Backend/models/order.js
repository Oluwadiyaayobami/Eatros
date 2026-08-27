const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerInfo: {
      name: { type: String },
      email: { type: String },
      phone: { type: String }
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    rejectedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "ACCEPTED_BY_VENDOR",
        "READY_FOR_PICKUP",
        "AGENT_ASSIGNED",
        "IN_TRANSIT",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "PENDING",
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    deliveryMethod: {
      type: String,
      enum: ["self", "agent"],
      default: "self",
    },
    // Coordinates [longitude, latitude] for mapping
    coordinates: {
      type: [Number],
      default: [0, 0], 
    },
    pickupQrCode: {
      type: String, // Hashed string or unique ID for the agent to scan at the vendor
    },
    dropoffQrCode: {
      type: String, // Hashed string or unique ID for the customer to scan from the agent
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
