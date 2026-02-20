const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    otp: String,
    otpExpiry: Date,
    isEmailVerified: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("User", userSchema);
