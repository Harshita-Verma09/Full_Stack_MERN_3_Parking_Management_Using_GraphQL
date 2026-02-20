
const User = require("../models/User");
const ParkingSlot = require("../models/ParkingSlot");
const Booking = require("../models/Booking");
const generateOTP = require("../utils/generateOTP");
const sendOTP = require("../utils/sendOTP");
const jwt = require("jsonwebtoken");


//  Helper: Get Logged-in User ID from Authorization Header
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

    // Dashboard Stats
    dashboardStats: async () => {
      const totalSlots = await ParkingSlot.countDocuments();
      const occupiedSlots = await ParkingSlot.countDocuments({ isOccupied: true });
      const totalBookings = await Booking.countDocuments();
      const totalCars = await Booking.countDocuments({ vehicleType: "car" });
      const totalBikes = await Booking.countDocuments({ vehicleType: "bike" });

      const now = new Date();

      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0, 0, 0, 0
      );

      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23, 59, 59, 999
      );

      const todayBookings = await Booking.countDocuments({
        fromTime: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      });

      return {
        totalSlots,
        occupiedSlots,
        totalBookings,
        totalCars,
        totalBikes,
        todayBookings,
        todayDate: now.toLocaleDateString("en-GB")
      };
    },


    // Booking Analytics
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


    // Available Slots
    availableSlots: async () => {
      return await ParkingSlot.find({ isOccupied: false });
    },


    // My Bookings (Protected)
    myBookings: async (_, __, { req }) => {
      const userId = getUserId(req);
      return await Booking.find({ user: userId }).populate("slot");
    }

  },



  Mutation: {

    // Register
    register: async (_, { username, email }) => {
      const userExist = await User.findOne({ email });
      if (userExist) throw new Error("User already exists");

      await User.create({ username, email });
      return { message: "Registered successfully" };
    },


    // Login → Send OTP
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


    // Verify OTP → Return JWT Token (No Cookies)
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


    // Create Booking (Protected)
    createBooking: async (_, args, { req }) => {
      const userId = getUserId(req);

      const { slotId, vehicleType, vehicleNumber, fromTime, toTime } = args;

      const slot = await ParkingSlot.findById(slotId);
      if (!slot) throw new Error("Slot not found");
      if (slot.isOccupied) throw new Error("Slot already occupied");

      const start = new Date(fromTime);
      const end = new Date(toTime);

      const hours = (end - start) / (1000 * 60 * 60);
      if (hours <= 0) throw new Error("Invalid time range");

      const rate = vehicleType === "car" ? 50 : 20;
      const amount = Math.ceil(hours) * rate;

      await Booking.create({
        user: userId,
        slot: slotId,
        vehicleType,
        vehicleNumber,
        fromTime: start,
        toTime: end,
        amount
      });

      slot.isOccupied = true;
      await slot.save();

      return "Booking Successful";
    }

  }
};
