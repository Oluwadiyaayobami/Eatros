const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["customer", "agent", "vendor", "admin"],
      default: "customer",
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // ----------------------------------------------------
    // Shared Financial / Payout Info (for Agent & Vendor)
    // ----------------------------------------------------
    bankDetails: {
      accountName: { type: String, trim: true },
      accountNumber: { type: String, trim: true },
      bankName: { type: String, trim: true },
      payoutPreference: { 
        type: String, 
        enum: ["manual", "automatic_24h"],
        default: "manual"
      }
    },
    
    // ----------------------------------------------------
    // Agent-Specific Fields
    // ----------------------------------------------------
    agentDetails: {
      vehicleType: { type: String, trim: true },
      licensePlate: { type: String, trim: true },
      operatingZone: { type: String, trim: true },
      kycStatus: { 
        type: String, 
        enum: ["pending", "approved", "rejected", "none"], 
        default: "none" 
      },
      isOnline: { type: Boolean, default: false },
      idType: { type: String, trim: true },
      idNumber: { type: String, trim: true },
      idDocumentUrl: { type: String, default: "" },
      idDocumentBackUrl: { type: String, default: "" },
      selfieUrl: { type: String, default: "" },
      licenseDocumentUrl: { type: String, default: "" },
      vehicleRegistrationUrl: { type: String, default: "" }
    },
    
    // ----------------------------------------------------
    // Vendor/Restaurant-Specific Fields
    // ----------------------------------------------------
    vendorDetails: {
      vendorType: { type: String, enum: ["food", "groceries", "shops", "pharmacy"], default: "food" },
      restaurantName: { type: String, trim: true },
      description: { type: String, trim: true },
      storeAddress: { type: String, trim: true },
      businessStatus: { type: String, enum: ["OPEN", "CLOSED"], default: "OPEN" },
      coverImage: { type: String, default: "" },
      profileImage: { type: String, default: "" },
      bannerImage: { type: String, default: "" },
      backgroundImage: { type: String, default: "" },
      isOpen: { type: Boolean, default: false },
      rating: { type: Number, default: 0 },
      ratingCount: { type: Number, default: 0 },
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
