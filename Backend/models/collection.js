const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

// Ensure a vendor cannot have two collections with the exact same name
collectionSchema.index({ vendorId: 1, name: 1 }, { unique: true });

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;
