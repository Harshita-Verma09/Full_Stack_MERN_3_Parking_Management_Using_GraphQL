// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     },
//     slot: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "ParkingSlot"
//     },
//     vehicleType: {
//         type: String,
//         enum: ["car", "bike"]
//     },
//     vehicleNumber: String,
//     fromTime: Date,
//     toTime: Date,
//     amount: Number,
//     status: {
//         type: String,
//         enum: ["active", "completed"],
//         default: "active"
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     qrToken: {
//         type: String,
//         unique: true
//     },
//     entryStatus: {
//         type: String,
//         enum: ["PENDING", "ENTERED"],
//         default: "PENDING"
//     }

// });

// module.exports = mongoose.model("Booking", bookingSchema);
















const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ParkingSlot",
        required: true
    },
    vehicleType: {
        type: String,
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    fromTime: {
        type: Date,
        required: true
    },
    toTime: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    qrToken: {
        type: String,
        required: true
    },
    entryStatus: {
        type: String,
        default: "PENDING"
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("Booking", bookingSchema);