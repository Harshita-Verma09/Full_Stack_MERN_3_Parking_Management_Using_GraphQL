const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ParkingSlot"
    },
    vehicleType: {
        type: String,
        enum: ["car", "bike"]
    },
    vehicleNumber: String,
    fromTime: Date,
    toTime: Date,
    amount: Number,
    status: {
        type: String,
        enum: ["active", "completed"],
        default: "active"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Booking", bookingSchema);
