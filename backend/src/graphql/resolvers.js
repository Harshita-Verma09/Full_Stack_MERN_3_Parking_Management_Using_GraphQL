

const User = require("../models/User");
const ParkingSlot = require("../models/ParkingSlot");
const Booking = require("../models/Booking");
const generateOTP = require("../utils/generateOTP");
const sendOTP = require("../utils/sendOTP");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Helper: Get Logged-in User ID
const getUserId = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (err) {
    throw new Error("Invalid or Expired Token");
  }
};

module.exports = {
  Query: {

    dashboardStats: async () => {
      const totalSlots = await ParkingSlot.countDocuments();
      const occupiedSlots = await ParkingSlot.countDocuments({ isOccupied: true });
      const totalBookings = await Booking.countDocuments();
      const totalCars = await Booking.countDocuments({ vehicleType: "car" });
      const totalBikes = await Booking.countDocuments({ vehicleType: "bike" });

      const now = new Date();

      // const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      // const endOfDay = new Date(now.setHours(23, 59, 59, 999));

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const todayBookings = await Booking.countDocuments({
        fromTime: { $gte: startOfDay, $lte: endOfDay }
      });

      return {
        totalSlots,
        occupiedSlots,
        totalBookings,
        totalCars,
        totalBikes,
        todayBookings,
        todayDate: new Date().toLocaleDateString("en-GB")
      };
    },

    bookingAnalytics: async () => {
      const analytics = await Booking.aggregate([
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$fromTime"
              }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      return analytics.map(item => ({
        date: item._id,
        count: item.count
      }));
    },

    availableSlots: async () => {
      return await ParkingSlot.find({ isOccupied: false });
    },

    myBookings: async (_, __, { req }) => {
      const userId = getUserId(req);

      const now = new Date();

      return await Booking.find({
        user: userId,

      })
        .populate("slot")
        .sort({ createdAt: -1 });
    },

    bookingsByEmail: async (_, { email }) => {

      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("User not found");
      }

      const bookings = await Booking.find({ user: user._id })
        .populate("slot")
        .sort({ createdAt: -1 }); // latest booking first

      return bookings;
    },
    // scanBookingsByEmail: async (_, { email }) => {

    //   const user = await User.findOne({ email });

    //   if (!user) {
    //     throw new Error("User not found");
    //   }

    //   const startOfDay = new Date();
    //   startOfDay.setHours(0, 0, 0, 0);

    //   const endOfDay = new Date();
    //   endOfDay.setHours(23, 59, 59, 999);

    //   const bookings = await Booking.find({
    //     user: user._id,
    //     fromTime: { $lte: endOfDay },
    //     toTime: { $gte: startOfDay }
    //   }).populate("slot");

    //   return bookings;
    // }



    scanBookings: async (_, __, { req }) => {

      const userId = getUserId(req);

      console.log("USER ID FROM TOKEN:", userId);

      const bookings = await Booking.find({ user: userId })
        .populate("slot")
        .sort({ createdAt: -1 });

      console.log("BOOKINGS FOUND:", bookings);

      return bookings;
    }


  },

  Mutation: {

    register: async (_, { username, email }) => {
      const userExist = await User.findOne({ email });
      if (userExist) throw new Error("User already exists");

      await User.create({ username, email });
      return { message: "Registered successfully" };
    },

    login: async (_, { email }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid Email");

      const otp = generateOTP();
      user.otp = otp;
      user.otpExpiry = Date.now() + 5 * 60 * 1000;
      await user.save();

      await sendOTP(email, otp);

      return { message: "OTP sent to email" };
    },

    verifyOTP: async (_, { email, otp }) => {
      const user = await User.findOne({ email });

      if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
        throw new Error("Invalid or expired OTP");
      }

      user.otp = null;
      user.otpExpiry = null;
      user.isEmailVerified = true;
      await user.save();

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return {
        message: "Auth completed successfully",
        token
      };
    },

    createBooking: async (_, args, { req }) => {
      const userId = getUserId(req);

      const { slotId, vehicleType, vehicleNumber, fromTime, toTime } = args;

      const slot = await ParkingSlot.findById(slotId);
      if (!slot) throw new Error("Slot not found");
      if (slot.isOccupied) throw new Error("Slot already occupied");

      const start = new Date(fromTime);
      const end = new Date(toTime);

      // validation add karo
      if (isNaN(start) || isNaN(end)) {
        throw new Error("Invalid Date format");
      }

      const hours = (end - start) / (1000 * 60 * 60);
      if (hours <= 0) throw new Error("Invalid time range");

      const rate = vehicleType === "car" ? 50 : 20;
      const amount = Math.ceil(hours) * rate;

      const qrToken = crypto.randomBytes(16).toString("hex");

      const booking = await Booking.create({
        user: userId,
        slot: slotId,
        vehicleType,
        vehicleNumber,
        fromTime: start,
        toTime: end,
        amount,
        qrToken,
        entryStatus: "PENDING"
      });

      slot.isOccupied = true;
      await slot.save();

      return {
        message: "Booking Successful",
        qrToken
      };
    },

    verifyBookingByToken: async (_, { token }) => {
      const booking = await Booking.findOne({ qrToken: token })
        .populate("user")
        .populate("slot");

      if (!booking) throw new Error("Invalid QR Code");
      if (booking.entryStatus === "ENTERED")
        throw new Error("Vehicle already entered");
      if (new Date() > booking.toTime)
        throw new Error("Booking expired");

      booking.entryStatus = "ENTERED";
      await booking.save();

      return booking;
    },



  }
};
