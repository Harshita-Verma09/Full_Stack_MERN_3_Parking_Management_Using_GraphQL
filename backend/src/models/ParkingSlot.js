const mongoose = require("mongoose");

const parkingSlotSchema = new mongoose.Schema({
  slotNumber: String,
  type: { type: String, enum: ["car", "bike"] },
  isOccupied: { type: Boolean, default: false }
});

module.exports = mongoose.model("ParkingSlot", parkingSlotSchema);
