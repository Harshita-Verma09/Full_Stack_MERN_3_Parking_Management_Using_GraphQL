

// // // const User = require("../models/User");
// // // const ParkingSlot = require("../models/ParkingSlot");
// // // const Booking = require("../models/Booking");
// // // const generateOTP = require("../utils/generateOTP");
// // // const sendOTP = require("../utils/sendOTP");
// // // const jwt = require("jsonwebtoken");
// // // const crypto = require("crypto");

// // // // Helper: Get Logged-in User ID
// // // const getUserId = (req) => {
// // //   const authHeader = req.headers.authorization;

// // //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
// // //     throw new Error("Unauthorized");
// // //   }

// // //   const token = authHeader.split(" ")[1];

// // //   try {
// // //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// // //     return decoded.id;
// // //   } catch (err) {
// // //     throw new Error("Invalid or Expired Token");
// // //   }
// // // };

// // // module.exports = {
// // //   Query: {

// // //     dashboardStats: async () => {
// // //       const totalSlots = await ParkingSlot.countDocuments();
// // //       const occupiedSlots = await ParkingSlot.countDocuments({ isOccupied: true });
// // //       const totalBookings = await Booking.countDocuments();
// // //       const totalCars = await Booking.countDocuments({ vehicleType: "car" });
// // //       const totalBikes = await Booking.countDocuments({ vehicleType: "bike" });

// // //       const now = new Date();

// // //       // const startOfDay = new Date(now.setHours(0, 0, 0, 0));
// // //       // const endOfDay = new Date(now.setHours(23, 59, 59, 999));

// // //       const startOfDay = new Date();
// // //       startOfDay.setHours(0, 0, 0, 0);

// // //       const endOfDay = new Date();
// // //       endOfDay.setHours(23, 59, 59, 999);
// // //       const todayBookings = await Booking.countDocuments({
// // //         fromTime: { $gte: startOfDay, $lte: endOfDay }
// // //       });

// // //       return {
// // //         totalSlots,
// // //         occupiedSlots,
// // //         totalBookings,
// // //         totalCars,
// // //         totalBikes,
// // //         todayBookings,
// // //         todayDate: new Date().toLocaleDateString("en-GB")
// // //       };
// // //     },

// // //     bookingAnalytics: async () => {
// // //       const analytics = await Booking.aggregate([
// // //         {
// // //           $group: {
// // //             _id: {
// // //               $dateToString: {
// // //                 format: "%Y-%m-%d",
// // //                 date: "$fromTime"
// // //               }
// // //             },
// // //             count: { $sum: 1 }
// // //           }
// // //         },
// // //         { $sort: { _id: 1 } }
// // //       ]);

// // //       return analytics.map(item => ({
// // //         date: item._id,
// // //         count: item.count
// // //       }));
// // //     },

// // //     availableSlots: async () => {
// // //       return await ParkingSlot.find({ isOccupied: false });
// // //     },

// // //     myBookings: async (_, __, { req }) => {
// // //       const userId = getUserId(req);

// // //       const now = new Date();

// // //       return await Booking.find({
// // //         user: userId,

// // //       })
// // //         .populate("slot")
// // //         .sort({ createdAt: -1 });
// // //     },

// // //     bookingsByEmail: async (_, { email }) => {

// // //       const user = await User.findOne({ email });

// // //       if (!user) {
// // //         throw new Error("User not found");
// // //       }

// // //       const bookings = await Booking.find({ user: user._id })
// // //         .populate("slot")
// // //         .sort({ createdAt: -1 }); // latest booking first

// // //       return bookings;
// // //     },
// // //     // scanBookingsByEmail: async (_, { email }) => {

// // //     //   const user = await User.findOne({ email });

// // //     //   if (!user) {
// // //     //     throw new Error("User not found");
// // //     //   }

// // //     //   const startOfDay = new Date();
// // //     //   startOfDay.setHours(0, 0, 0, 0);

// // //     //   const endOfDay = new Date();
// // //     //   endOfDay.setHours(23, 59, 59, 999);

// // //     //   const bookings = await Booking.find({
// // //     //     user: user._id,
// // //     //     fromTime: { $lte: endOfDay },
// // //     //     toTime: { $gte: startOfDay }
// // //     //   }).populate("slot");

// // //     //   return bookings;
// // //     // }



// // //     scanBookings: async (_, __, { req }) => {

// // //       const userId = getUserId(req);

// // //       console.log("USER ID FROM TOKEN:", userId);

// // //       const bookings = await Booking.find({ user: userId })
// // //         .populate("slot")
// // //         .sort({ createdAt: -1 });

// // //       console.log("BOOKINGS FOUND:", bookings);

// // //       return bookings;
// // //     }


// // //   },

// // //   Mutation: {

// // //     register: async (_, { username, email }) => {
// // //       const userExist = await User.findOne({ email });
// // //       if (userExist) throw new Error("User already exists");

// // //       await User.create({ username, email });
// // //       return { message: "Registered successfully" };
// // //     },

// // //     login: async (_, { email }) => {
// // //       const user = await User.findOne({ email });
// // //       if (!user) throw new Error("Invalid Email");

// // //       const otp = generateOTP();
// // //       user.otp = otp;
// // //       user.otpExpiry = Date.now() + 5 * 60 * 1000;
// // //       await user.save();

// // //       await sendOTP(email, otp);

// // //       return { message: "OTP sent to email" };
// // //     },

// // //     verifyOTP: async (_, { email, otp }) => {
// // //       const user = await User.findOne({ email });

// // //       if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
// // //         throw new Error("Invalid or expired OTP");
// // //       }

// // //       user.otp = null;
// // //       user.otpExpiry = null;
// // //       user.isEmailVerified = true;
// // //       await user.save();

// // //       const token = jwt.sign(
// // //         { id: user._id },
// // //         process.env.JWT_SECRET,
// // //         { expiresIn: "1d" }
// // //       );

// // //       return {
// // //         message: "Auth completed successfully",
// // //         token
// // //       };
// // //     },

// // //     createBooking: async (_, args, { req }) => {
// // //       const userId = getUserId(req);

// // //       const { slotId, vehicleType, vehicleNumber, fromTime, toTime } = args;

// // //       const slot = await ParkingSlot.findById(slotId);
// // //       if (!slot) throw new Error("Slot not found");
// // //       if (slot.isOccupied) throw new Error("Slot already occupied");

// // //       const start = new Date(fromTime);
// // //       const end = new Date(toTime);

// // //       // validation add karo
// // //       if (isNaN(start) || isNaN(end)) {
// // //         throw new Error("Invalid Date format");
// // //       }

// // //       const hours = (end - start) / (1000 * 60 * 60);
// // //       if (hours <= 0) throw new Error("Invalid time range");

// // //       const rate = vehicleType === "car" ? 50 : 20;
// // //       const amount = Math.ceil(hours) * rate;

// // //       const qrToken = crypto.randomBytes(16).toString("hex");

// // //       const booking = await Booking.create({
// // //         user: userId,
// // //         slot: slotId,
// // //         vehicleType,
// // //         vehicleNumber,
// // //         fromTime: start,
// // //         toTime: end,
// // //         amount,
// // //         qrToken,
// // //         entryStatus: "PENDING"
// // //       });

// // //       slot.isOccupied = true;
// // //       await slot.save();

// // //       return {
// // //         message: "Booking Successful",
// // //         qrToken
// // //       };
// // //     },

// // //     verifyBookingByToken: async (_, { token }) => {
// // //       const booking = await Booking.findOne({ qrToken: token })
// // //         .populate("user")
// // //         .populate("slot");

// // //       if (!booking) throw new Error("Invalid QR Code");
// // //       if (booking.entryStatus === "ENTERED")
// // //         throw new Error("Vehicle already entered");
// // //       if (new Date() > booking.toTime)
// // //         throw new Error("Booking expired");

// // //       booking.entryStatus = "ENTERED";
// // //       await booking.save();

// // //       return booking;
// // //     },



// // //   }
// // // };

















// // // //    SHI VALA

// // // const User = require("../models/User");
// // // const ParkingSlot = require("../models/ParkingSlot");
// // // const Booking = require("../models/Booking");
// // // const generateOTP = require("../utils/generateOTP");
// // // const sendOTP = require("../utils/sendOTP");
// // // const jwt = require("jsonwebtoken");
// // // const crypto = require("crypto");

// // // // ================= AUTH HELPER =================
// // // const getUserId = (req) => {
// // //   const authHeader = req.headers.authorization;

// // //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
// // //     throw new Error("Unauthorized");
// // //   }

// // //   const token = authHeader.split(" ")[1];

// // //   try {
// // //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// // //     return decoded.id;
// // //   } catch (err) {
// // //     throw new Error("Invalid or Expired Token");
// // //   }
// // // };

// // // // ================= SLOT AVAILABILITY =================
// // // const isSlotAvailable = async (slotId, start, end) => {
// // //   const overlapping = await Booking.findOne({
// // //     slot: slotId,
// // //     $or: [
// // //       {
// // //         fromTime: { $lt: end },
// // //         toTime: { $gt: start }
// // //       }
// // //     ]
// // //   });

// // //   return !overlapping;
// // // };

// // // module.exports = {
// // //   Query: {

// // //     dashboardStats: async () => {
// // //       const totalSlots = await ParkingSlot.countDocuments();
// // //       const occupiedSlots = await ParkingSlot.countDocuments({ isOccupied: true });
// // //       const totalBookings = await Booking.countDocuments();
// // //       const totalCars = await Booking.countDocuments({ vehicleType: "car" });
// // //       const totalBikes = await Booking.countDocuments({ vehicleType: "bike" });

// // //       const startOfDay = new Date();
// // //       startOfDay.setHours(0, 0, 0, 0);

// // //       const endOfDay = new Date();
// // //       endOfDay.setHours(23, 59, 59, 999);

// // //       const todayBookings = await Booking.countDocuments({
// // //         fromTime: { $gte: startOfDay, $lte: endOfDay }
// // //       });

// // //       return {
// // //         totalSlots,
// // //         occupiedSlots,
// // //         totalBookings,
// // //         totalCars,
// // //         totalBikes,
// // //         todayBookings,
// // //         todayDate: new Date().toLocaleDateString("en-GB")
// // //       };
// // //     },

// // //     bookingAnalytics: async () => {
// // //       const analytics = await Booking.aggregate([
// // //         {
// // //           $group: {
// // //             _id: {
// // //               $dateToString: {
// // //                 format: "%Y-%m-%d",
// // //                 date: "$fromTime"
// // //               }
// // //             },
// // //             count: { $sum: 1 }
// // //           }
// // //         },
// // //         { $sort: { _id: 1 } }
// // //       ]);

// // //       return analytics.map(item => ({
// // //         date: item._id,
// // //         count: item.count
// // //       }));
// // //     },

// // //     // ✅ TIME BASED AVAILABLE SLOTS
// // //     availableSlots: async (_, { fromTime, toTime }) => {
// // //       const start = new Date(fromTime);
// // //       const end = new Date(toTime);

// // //       const bookedSlots = await Booking.find({
// // //         $or: [
// // //           {
// // //             fromTime: { $lt: end },
// // //             toTime: { $gt: start }
// // //           }
// // //         ]
// // //       }).distinct("slot");

// // //       return await ParkingSlot.find({
// // //         _id: { $nin: bookedSlots }
// // //       });
// // //     },

// // //     myBookings: async (_, __, { req }) => {
// // //       const userId = getUserId(req);

// // //       return await Booking.find({ user: userId })
// // //         .populate("slot")
// // //         .sort({ createdAt: -1 });
// // //     },

// // //     scanBookings: async (_, __, { req }) => {
// // //       const userId = getUserId(req);

// // //       return await Booking.find({ user: userId })
// // //         .populate("slot")
// // //         .sort({ createdAt: -1 });
// // //     }

// // //   },

// // //   Mutation: {

// // //     // ================= AUTH =================

// // //     register: async (_, { username, email }) => {
// // //       const userExist = await User.findOne({ email });
// // //       if (userExist) throw new Error("User already exists");

// // //       await User.create({ username, email });
// // //       return { message: "Registered successfully" };
// // //     },

// // //     login: async (_, { email }) => {
// // //       const user = await User.findOne({ email });

// // //       // prevent email enumeration
// // //       if (!user) {
// // //         return { message: "If email exists, OTP sent" };
// // //       }

// // //       const otp = generateOTP();

// // //       user.otp = otp;
// // //       user.otpAttempts = 0;
// // //       user.otpExpiry = Date.now() + 5 * 60 * 1000;

// // //       await user.save();
// // //       await sendOTP(email, otp);

// // //       return { message: "OTP sent" };
// // //     },

// // //     verifyOTP: async (_, { email, otp }) => {
// // //       const user = await User.findOne({ email });

// // //       if (!user) throw new Error("Invalid request");

// // //       if (user.otpAttempts >= 5) {
// // //         throw new Error("Too many attempts");
// // //       }

// // //       if (user.otp !== otp || user.otpExpiry < Date.now()) {
// // //         user.otpAttempts += 1;
// // //         await user.save();
// // //         throw new Error("Invalid or expired OTP");
// // //       }

// // //       user.otp = null;
// // //       user.otpExpiry = null;
// // //       user.otpAttempts = 0;
// // //       user.isEmailVerified = true;

// // //       await user.save();

// // //       const token = jwt.sign(
// // //         { id: user._id },
// // //         process.env.JWT_SECRET,
// // //         { expiresIn: "1d" }
// // //       );

// // //       return {
// // //         message: "Auth successful",
// // //         token
// // //       };
// // //     },

// // //     // ================= BOOKING =================

// // //     createBooking: async (_, args, { req }) => {
// // //       const userId = getUserId(req);

// // //       const { slotId, vehicleType, vehicleNumber, fromTime, toTime } = args;

// // //       const slot = await ParkingSlot.findById(slotId);
// // //       if (!slot) throw new Error("Slot not found");

// // //       const start = new Date(fromTime);
// // //       const end = new Date(toTime);

// // //       if (isNaN(start) || isNaN(end)) {
// // //         throw new Error("Invalid Date format");
// // //       }

// // //       if (start < new Date()) {
// // //         throw new Error("Cannot book past time");
// // //       }

// // //       const hours = (end - start) / (1000 * 60 * 60);
// // //       if (hours <= 0) throw new Error("Invalid time range");

// // //       // ✅ TIME OVERLAP CHECK
// // //       const available = await isSlotAvailable(slotId, start, end);
// // //       if (!available) {
// // //         throw new Error("Slot already booked for this time");
// // //       }

// // //       // ✅ VEHICLE VALIDATION
// // //       const regex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
// // //       if (!regex.test(vehicleNumber)) {
// // //         throw new Error("Invalid vehicle number");
// // //       }

// // //       const rate = vehicleType === "car" ? 50 : 20;
// // //       const amount = Math.ceil(hours) * rate;

// // //       const qrToken = crypto.randomBytes(16).toString("hex");

// // //       await Booking.create({
// // //         user: userId,
// // //         slot: slotId,
// // //         vehicleType,
// // //         vehicleNumber,
// // //         fromTime: start,
// // //         toTime: end,
// // //         amount,
// // //         qrToken,
// // //         entryStatus: "PENDING"
// // //       });

// // //       return {
// // //         message: "Booking Successful",
// // //         qrToken
// // //       };
// // //     },

// // //     // ================= ENTRY =================

// // //     verifyBookingByToken: async (_, { token }) => {
// // //       const booking = await Booking.findOne({ qrToken: token })
// // //         .populate("user")
// // //         .populate("slot");

// // //       if (!booking) throw new Error("Invalid QR Code");

// // //       if (booking.entryStatus === "ENTERED") {
// // //         throw new Error("Already entered");
// // //       }

// // //       if (new Date() > booking.toTime) {
// // //         throw new Error("Booking expired");
// // //       }

// // //       booking.entryStatus = "ENTERED";
// // //       await booking.save();

// // //       // occupy slot

// // //       booking.slot.isOccupied = true;
// // //       await booking.slot.save();

// // //       return booking;
// // //     },

// // //     // ================= EXIT =================

// // //     exitParking: async (_, { token }) => {
// // //       const booking = await Booking.findOne({ qrToken: token })
// // //         .populate("slot");

// // //       if (!booking) throw new Error("Invalid booking");

// // //       booking.entryStatus = "EXITED";
// // //       await booking.save();

// // //       // free slot
// // //       booking.slot.isOccupied = false;
// // //       await booking.slot.save();

// // //       return { message: "Exit successful" };
// // //     }

// // //   }
// // // };










// // // const User = require("../models/User");
// // // const ParkingSlot = require("../models/ParkingSlot");
// // // const Booking = require("../models/Booking");
// // // const generateOTP = require("../utils/generateOTP");
// // // const sendOTP = require("../utils/sendOTP");
// // // const jwt = require("jsonwebtoken");
// // // const crypto = require("crypto");

// // // // ================= AUTH HELPER =================
// // // const getUserId = (req) => {
// // //   const authHeader = req.headers.authorization;

// // //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
// // //     throw new Error("Unauthorized");
// // //   }

// // //   const token = authHeader.split(" ")[1];

// // //   try {
// // //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// // //     return decoded.id;
// // //   } catch (err) {
// // //     throw new Error("Invalid or Expired Token");
// // //   }
// // // };

// // // // ================= SLOT AVAILABILITY =================
// // // const isSlotAvailable = async (slotId, start, end) => {
// // //   const overlapping = await Booking.findOne({
// // //     slot: slotId,
// // //     $or: [
// // //       {
// // //         fromTime: { $lt: end },
// // //         toTime: { $gt: start }
// // //       }
// // //     ]
// // //   });

// // //   return !overlapping;
// // // };

// // // module.exports = {
// // //   Query: {

// // //     dashboardStats: async () => {
// // //       const totalSlots = await ParkingSlot.countDocuments();
// // //       const occupiedSlots = await ParkingSlot.countDocuments({ isOccupied: true });
// // //       const totalBookings = await Booking.countDocuments();
// // //       const totalCars = await Booking.countDocuments({ vehicleType: "car" });
// // //       const totalBikes = await Booking.countDocuments({ vehicleType: "bike" });

// // //       const startOfDay = new Date();
// // //       startOfDay.setHours(0, 0, 0, 0);

// // //       const endOfDay = new Date();
// // //       endOfDay.setHours(23, 59, 59, 999);

// // //       const todayBookings = await Booking.countDocuments({
// // //         fromTime: { $gte: startOfDay, $lte: endOfDay }
// // //       });

// // //       return {
// // //         totalSlots,
// // //         occupiedSlots,
// // //         totalBookings,
// // //         totalCars,
// // //         totalBikes,
// // //         todayBookings,
// // //         todayDate: new Date().toLocaleDateString("en-GB")
// // //       };
// // //     },

// // //     bookingAnalytics: async () => {
// // //       const analytics = await Booking.aggregate([
// // //         {
// // //           $group: {
// // //             _id: {
// // //               $dateToString: {
// // //                 format: "%Y-%m-%d",
// // //                 date: "$fromTime"
// // //               }
// // //             },
// // //             count: { $sum: 1 }
// // //           }
// // //         },
// // //         { $sort: { _id: 1 } }
// // //       ]);

// // //       return analytics.map(item => ({
// // //         date: item._id,
// // //         count: item.count
// // //       }));
// // //     },

// // //     // ✅ TIME BASED AVAILABLE SLOTS
// // //     availableSlots: async (_, { fromTime, toTime }) => {
// // //       const start = new Date(fromTime);
// // //       const end = new Date(toTime);

// // //       const bookedSlots = await Booking.find({
// // //         $or: [
// // //           {
// // //             fromTime: { $lt: end },
// // //             toTime: { $gt: start }
// // //           }
// // //         ]
// // //       }).distinct("slot");

// // //       return await ParkingSlot.find({
// // //         _id: { $nin: bookedSlots }
// // //       });
// // //     },

// // //     myBookings: async (_, __, { req }) => {
// // //       const userId = getUserId(req);

// // //       return await Booking.find({ user: userId })
// // //         .populate("slot")
// // //         .sort({ createdAt: -1 });
// // //     },

// // //     scanBookings: async (_, __, { req }) => {
// // //       const userId = getUserId(req);

// // //       return await Booking.find({ user: userId })
// // //         .populate("slot")
// // //         .sort({ createdAt: -1 });
// // //     }

// // //   },

// // //   Mutation: {

// // //     // ================= AUTH =================

// // //     register: async (_, { username, email }) => {
// // //       const userExist = await User.findOne({ email });
// // //       if (userExist) throw new Error("User already exists");

// // //       await User.create({ username, email });
// // //       return { message: "Registered successfully" };
// // //     },

// // //     login: async (_, { email }) => {
// // //       const user = await User.findOne({ email });

// // //       // prevent email enumeration
// // //       if (!user) {
// // //         return { message: "If email exists, OTP sent" };
// // //       }

// // //       const otp = generateOTP();

// // //       user.otp = otp;
// // //       user.otpAttempts = 0;
// // //       user.otpExpiry = Date.now() + 5 * 60 * 1000;

// // //       await user.save();
// // //       await sendOTP(email, otp);

// // //       return { message: "OTP sent" };
// // //     },

// // //     verifyOTP: async (_, { email, otp }) => {
// // //       const user = await User.findOne({ email });

// // //       if (!user) throw new Error("Invalid request");

// // //       if (user.otpAttempts >= 5) {
// // //         throw new Error("Too many attempts");
// // //       }

// // //       if (user.otp !== otp || user.otpExpiry < Date.now()) {
// // //         user.otpAttempts += 1;
// // //         await user.save();
// // //         throw new Error("Invalid or expired OTP");
// // //       }

// // //       user.otp = null;
// // //       user.otpExpiry = null;
// // //       user.otpAttempts = 0;
// // //       user.isEmailVerified = true;

// // //       await user.save();

// // //       const token = jwt.sign(
// // //         { id: user._id },
// // //         process.env.JWT_SECRET,
// // //         { expiresIn: "1d" }
// // //       );

// // //       return {
// // //         message: "Auth successful",
// // //         token
// // //       };
// // //     },

// // //     // ================= BOOKING =================

// // //     createBooking: async (_, args, { req }) => {
// // //       const userId = getUserId(req);

// // //       const { slotId, vehicleType, vehicleNumber, fromTime, toTime } = args;
// // //       if (!fromTime || !toTime) {
// // //         throw new Error("Time required");
// // //       }
// // //       const slot = await ParkingSlot.findById(slotId);
// // //       if (!slot) throw new Error("Slot not found");

// // //       const start = new Date(fromTime);
// // //       const end = new Date(toTime);

// // //       if (isNaN(start) || isNaN(end)) {
// // //         throw new Error("Invalid Date format");
// // //       }

// // //       if (start < new Date()) {
// // //         throw new Error("Cannot book past time");
// // //       }

// // //       const hours = (end - start) / (1000 * 60 * 60);
// // //       if (hours <= 0) throw new Error("Invalid time range");
// // //       if (hours > 24) {
// // //         throw new Error("Max booking 24 hours");
// // //       }

// // //       // ✅ TIME OVERLAP CHECK
// // //       const available = await isSlotAvailable(slotId, start, end);
// // //       if (!available) {
// // //         throw new Error("Slot already booked for this time");
// // //       }

// // //       // ✅ VEHICLE VALIDATION
// // //       const regex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
// // //       if (!regex.test(vehicleNumber)) {
// // //         throw new Error("Invalid vehicle number");
// // //       }

// // //       const rate = vehicleType === "car" ? 50 : 20;

// // //       if (!["car", "bike"].includes(vehicleType)) {
// // //         throw new Error("Invalid vehicle type");
// // //       }
// // //       const amount = Math.ceil(hours) * rate;

// // //       const qrToken = crypto.randomBytes(16).toString("hex");

// // //       await Booking.create({
// // //         user: userId,
// // //         slot: slotId,
// // //         vehicleType,
// // //         vehicleNumber,
// // //         fromTime: start,
// // //         toTime: end,
// // //         amount,
// // //         qrToken,
// // //         entryStatus: "PENDING"
// // //       });

// // //       return {
// // //         message: "Booking Successful",
// // //         qrToken
// // //       };
// // //     },

// // //     // ================= ENTRY =================

// // //     verifyBookingByToken: async (_, { token }) => {
// // //       const booking = await Booking.findOne({ qrToken: token })
// // //         .populate("user")
// // //         .populate("slot");

// // //       if (!booking) throw new Error("Invalid QR Code");

// // //       if (booking.entryStatus === "ENTERED") {
// // //         throw new Error("Already entered");
// // //       }

// // //       if (new Date() > booking.toTime) {
// // //         throw new Error("Booking expired");
// // //       }

// // //       booking.entryStatus = "ENTERED";
// // //       await booking.save();

// // //       // occupy slot
// // //       if (booking.slot.isOccupied) {
// // //         throw new Error("Slot currently occupied");
// // //       }
// // //       booking.slot.isOccupied = true;
// // //       await booking.slot.save();

// // //       return booking;
// // //     },

// // //     // ================= EXIT =================

// // //     exitParking: async (_, { token }) => {
// // //       const booking = await Booking.findOne({ qrToken: token })
// // //         .populate("slot");

// // //       if (!booking) throw new Error("Invalid booking");

// // //       booking.entryStatus = "EXITED";
// // //       await booking.save();
// // //       if (booking.entryStatus === "EXITED") {
// // //         throw new Error("Booking already completed");
// // //       }

// // //       // free slot
// // //       booking.slot.isOccupied = false;
// // //       await booking.slot.save();

// // //       return { message: "Exit successful" };
// // //     }

// // //   }
// // // };










// // const mongoose = require("mongoose");
// // const User = require("../models/User");
// // const ParkingSlot = require("../models/ParkingSlot");
// // const Booking = require("../models/Booking");
// // const generateOTP = require("../utils/generateOTP");
// // const sendOTP = require("../utils/sendOTP");
// // const jwt = require("jsonwebtoken");
// // const crypto = require("crypto");

// // // ================= AUTH HELPER =================
// // const getUserId = (req) => {
// //   const authHeader = req.headers.authorization;

// //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
// //     throw new Error("Unauthorized");
// //   }

// //   const token = authHeader.split(" ")[1];

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     return decoded.id;
// //   } catch {
// //     throw new Error("Invalid or Expired Token");
// //   }
// // };

// // module.exports = {
// //   Query: {

// //     dashboardStats: async () => {
// //       const totalSlots = await ParkingSlot.countDocuments();
// //       const occupiedSlots = await ParkingSlot.countDocuments({ isOccupied: true });
// //       const totalBookings = await Booking.countDocuments();
// //       const totalCars = await Booking.countDocuments({ vehicleType: "car" });
// //       const totalBikes = await Booking.countDocuments({ vehicleType: "bike" });

// //       const startOfDay = new Date();
// //       startOfDay.setHours(0, 0, 0, 0);

// //       const endOfDay = new Date();
// //       endOfDay.setHours(23, 59, 59, 999);

// //       const todayBookings = await Booking.countDocuments({
// //         fromTime: { $gte: startOfDay, $lte: endOfDay }
// //       });

// //       return {
// //         totalSlots,
// //         occupiedSlots,
// //         totalBookings,
// //         totalCars,
// //         totalBikes,
// //         todayBookings,
// //         todayDate: new Date().toLocaleDateString("en-GB")
// //       };
// //     },

// //     bookingAnalytics: async () => {
// //       const analytics = await Booking.aggregate([
// //         {
// //           $group: {
// //             _id: {
// //               $dateToString: {
// //                 format: "%Y-%m-%d",
// //                 date: "$fromTime"
// //               }
// //             },
// //             count: { $sum: 1 }
// //           }
// //         },
// //         { $sort: { _id: 1 } }
// //       ]);

// //       return analytics.map(item => ({
// //         date: item._id,
// //         count: item.count
// //       }));
// //     },

// //     availableSlots: async (_, { fromTime, toTime }) => {
// //       if (!fromTime || !toTime) {
// //         throw new Error("Time required");
// //       }

// //       const start = new Date(fromTime);
// //       const end = new Date(toTime);

// //       const bookedSlots = await Booking.find({
// //         $or: [
// //           { fromTime: { $lt: end }, toTime: { $gt: start } }
// //         ]
// //       }).distinct("slot");

// //       return await ParkingSlot.find({
// //         _id: { $nin: bookedSlots }
// //       });
// //     },

// //     myBookings: async (_, __, { req }) => {
// //       const userId = getUserId(req);

// //       return await Booking.find({ user: userId })
// //         .populate("slot")
// //         .sort({ createdAt: -1 });
// //     },

// //     scanBookings: async (_, __, { req }) => {
// //       const userId = getUserId(req);

// //       return await Booking.find({ user: userId })
// //         .populate("slot")
// //         .sort({ createdAt: -1 });
// //     }

// //   },

// //   Mutation: {

// //     // ================= AUTH =================

// //     register: async (_, { username, email }) => {
// //       const userExist = await User.findOne({ email });
// //       if (userExist) throw new Error("User already exists");

// //       await User.create({ username, email });
// //       return { message: "Registered successfully" };
// //     },

// //     login: async (_, { email }) => {
// //       const user = await User.findOne({ email });

// //       if (!user) {
// //         return { message: "If email exists, OTP sent" };
// //       }

// //       const otp = generateOTP();

// //       user.otp = otp;
// //       user.otpAttempts = 0;
// //       user.otpExpiry = Date.now() + 5 * 60 * 1000;

// //       await user.save();
// //       await sendOTP(email, otp);

// //       return { message: "OTP sent" };
// //     },

// //     verifyOTP: async (_, { email, otp }) => {
// //       const user = await User.findOne({ email });

// //       if (!user) throw new Error("Invalid request");

// //       if (user.otpAttempts >= 5) {
// //         throw new Error("Too many attempts");
// //       }

// //       if (user.otp !== otp || user.otpExpiry < Date.now()) {
// //         user.otpAttempts += 1;
// //         await user.save();
// //         throw new Error("Invalid or expired OTP");
// //       }

// //       user.otp = null;
// //       user.otpExpiry = null;
// //       user.otpAttempts = 0;
// //       user.isEmailVerified = true;

// //       await user.save();

// //       const token = jwt.sign(
// //         { id: user._id },
// //         process.env.JWT_SECRET,
// //         { expiresIn: "1d" }
// //       );

// //       return {
// //         message: "Auth successful",
// //         token
// //       };
// //     },

// //     // ================= BOOKING =================

// //     createBooking: async (_, args, { req }) => {
// //       const userId = getUserId(req);

// //       const { slotId, vehicleType, vehicleNumber, fromTime, toTime } = args;

// //       if (!fromTime || !toTime) {
// //         throw new Error("Time required");
// //       }

// //       const start = new Date(fromTime);
// //       const end = new Date(toTime);

// //       if (isNaN(start) || isNaN(end)) {
// //         throw new Error("Invalid Date format");
// //       }

// //       if (start < new Date()) {
// //         throw new Error("Cannot book past time");
// //       }

// //       const hours = (end - start) / (1000 * 60 * 60);
// //       if (hours <= 0) throw new Error("Invalid time range");
// //       if (hours > 24) throw new Error("Max booking 24 hours");

// //       if (!["car", "bike"].includes(vehicleType)) {
// //         throw new Error("Invalid vehicle type");
// //       }

// //       const regex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
// //       if (!regex.test(vehicleNumber)) {
// //         throw new Error("Invalid vehicle number");
// //       }

// //       // user active booking check
// //       const activeBooking = await Booking.findOne({
// //         user: userId,
// //         toTime: { $gt: new Date() },
// //         entryStatus: { $ne: "EXITED" }
// //       });

// //       if (activeBooking) {
// //         throw new Error("You already have an active booking");
// //       }

// //       const session = await mongoose.startSession();
// //       session.startTransaction();

// //       try {
// //         const slot = await ParkingSlot.findById(slotId).session(session);
// //         if (!slot) throw new Error("Slot not found");

// //         const overlapping = await Booking.findOne({
// //           slot: slotId,
// //           $or: [
// //             { fromTime: { $lt: end }, toTime: { $gt: start } }
// //           ]
// //         }).session(session);

// //         if (overlapping) {
// //           throw new Error("Slot already booked for this time");
// //         }

// //         const rate = vehicleType === "car" ? 50 : 20;
// //         const amount = Math.ceil(hours) * rate;

// //         const qrToken = crypto.randomBytes(16).toString("hex");

// //         await Booking.create([{
// //           user: userId,
// //           slot: slotId,
// //           vehicleType,
// //           vehicleNumber,
// //           fromTime: start,
// //           toTime: end,
// //           amount,
// //           qrToken,
// //           entryStatus: "PENDING"
// //         }], { session });

// //         await session.commitTransaction();

// //         return {
// //           message: "Booking Successful",
// //           qrToken
// //         };

// //       } catch (err) {
// //         await session.abortTransaction();
// //         throw err;
// //       } finally {
// //         session.endSession();
// //       }
// //     },

// //     // ================= ENTRY =================

// //     verifyBookingByToken: async (_, { token }) => {
// //       const booking = await Booking.findOne({ qrToken: token })
// //         .populate("slot")
// //         .populate("user");

// //       if (!booking) throw new Error("Invalid QR Code");

// //       if (booking.entryStatus === "ENTERED") {
// //         throw new Error("Already entered");
// //       }

// //       if (booking.entryStatus === "EXITED") {
// //         throw new Error("Booking already completed");
// //       }

// //       if (new Date() > booking.toTime) {
// //         throw new Error("Booking expired");
// //       }

// //       if (booking.slot.isOccupied) {
// //         throw new Error("Slot currently occupied");
// //       }

// //       booking.entryStatus = "ENTERED";
// //       await booking.save();

// //       booking.slot.isOccupied = true;
// //       await booking.slot.save();

// //       return booking;
// //     },

// //     // ================= EXIT =================

// //     exitParking: async (_, { token }) => {
// //       const booking = await Booking.findOne({ qrToken: token })
// //         .populate("slot");

// //       if (!booking) throw new Error("Invalid booking");

// //       if (booking.entryStatus === "EXITED") {
// //         throw new Error("Already exited");
// //       }

// //       if (booking.entryStatus !== "ENTERED") {
// //         throw new Error("Vehicle not entered yet");
// //       }

// //       booking.entryStatus = "EXITED";
// //       await booking.save();

// //       booking.slot.isOccupied = false;
// //       await booking.slot.save();

// //       return { message: "Exit successful" };
// //     }

// //   }
// // };









// // const mongoose = require("mongoose");
// // const User = require("../models/User");
// // const ParkingSlot = require("../models/ParkingSlot");
// // const Booking = require("../models/Booking");
// // const generateOTP = require("../utils/generateOTP");
// // const sendOTP = require("../utils/sendOTP");
// // const jwt = require("jsonwebtoken");
// // const crypto = require("crypto");

// // // ================= AUTH HELPER =================
// // const getUserId = (req) => {
// //   const authHeader = req.headers.authorization;

// //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
// //     throw new Error("Unauthorized");
// //   }

// //   const token = authHeader.split(" ")[1];

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     return decoded.id;
// //   } catch {
// //     throw new Error("Invalid or Expired Token");
// //   }
// // };

// // module.exports = {
// //   Query: {

// //     dashboardStats: async () => {
// //       const totalSlots = await ParkingSlot.countDocuments();
// //       const occupiedSlots = await ParkingSlot.countDocuments({ isOccupied: true });
// //       const totalBookings = await Booking.countDocuments();
// //       const totalCars = await Booking.countDocuments({ vehicleType: "car" });
// //       const totalBikes = await Booking.countDocuments({ vehicleType: "bike" });

// //       const startOfDay = new Date();
// //       startOfDay.setHours(0, 0, 0, 0);

// //       const endOfDay = new Date();
// //       endOfDay.setHours(23, 59, 59, 999);

// //       const todayBookings = await Booking.countDocuments({
// //         fromTime: { $gte: startOfDay, $lte: endOfDay }
// //       });

// //       return {
// //         totalSlots,
// //         occupiedSlots,
// //         totalBookings,
// //         totalCars,
// //         totalBikes,
// //         todayBookings,
// //         todayDate: new Date().toLocaleDateString("en-GB")
// //       };
// //     },

// //     bookingAnalytics: async () => {
// //       const analytics = await Booking.aggregate([
// //         {
// //           $group: {
// //             _id: {
// //               $dateToString: {
// //                 format: "%Y-%m-%d",
// //                 date: "$fromTime"
// //               }
// //             },
// //             count: { $sum: 1 }
// //           }
// //         },
// //         { $sort: { _id: 1 } }
// //       ]);

// //       return analytics.map(item => ({
// //         date: item._id,
// //         count: item.count
// //       }));
// //     },

// //     availableSlots: async (_, { fromTime, toTime }) => {
// //       if (!fromTime || !toTime) {
// //         throw new Error("Time required");
// //       }

// //       const start = new Date(fromTime);
// //       const end = new Date(toTime);

// //       const bookedSlots = await Booking.find({
// //         $or: [
// //           { fromTime: { $lt: end }, toTime: { $gt: start } }
// //         ]
// //       }).distinct("slot");

// //       return await ParkingSlot.find({
// //         _id: { $nin: bookedSlots }
// //       });
// //     },

// //     myBookings: async (_, __, { req }) => {
// //       const userId = getUserId(req);

// //       return await Booking.find({ user: userId })
// //         .populate("slot")
// //         .sort({ createdAt: -1 });
// //     },

// //     scanBookings: async (_, __, { req }) => {
// //       const userId = getUserId(req);

// //       return await Booking.find({ user: userId })
// //         .populate("slot")
// //         .sort({ createdAt: -1 });
// //     }

// //   },

// //   Mutation: {

// //     // ================= AUTH =================

// //     register: async (_, { username, email }) => {
// //       const userExist = await User.findOne({ email });
// //       if (userExist) throw new Error("User already exists");

// //       await User.create({ username, email });
// //       return { message: "Registered successfully" };
// //     },

// //     login: async (_, { email }) => {
// //       const user = await User.findOne({ email });

// //       if (!user) {
// //         return { message: "If email exists, OTP sent" };
// //       }

// //       const otp = generateOTP();

// //       user.otp = otp;
// //       user.otpAttempts = 0;
// //       user.otpExpiry = Date.now() + 5 * 60 * 1000;

// //       await user.save();
// //       await sendOTP(email, otp);

// //       return { message: "OTP sent" };
// //     },

// //     verifyOTP: async (_, { email, otp }) => {
// //       const user = await User.findOne({ email });

// //       if (!user) throw new Error("Invalid request");

// //       if (user.otpAttempts >= 5) {
// //         throw new Error("Too many attempts");
// //       }

// //       if (user.otp !== otp || user.otpExpiry < Date.now()) {
// //         user.otpAttempts += 1;
// //         await user.save();
// //         throw new Error("Invalid or expired OTP");
// //       }

// //       user.otp = null;
// //       user.otpExpiry = null;
// //       user.otpAttempts = 0;
// //       user.isEmailVerified = true;

// //       await user.save();

// //       const token = jwt.sign(
// //         { id: user._id },
// //         process.env.JWT_SECRET,
// //         { expiresIn: "1d" }
// //       );

// //       return {
// //         message: "Auth successful",
// //         token
// //       };
// //     },

// //     // ================= BOOKING =================

// //     createBooking: async (_, args, { req }) => {
// //       const userId = getUserId(req);

// //       const { slotId, vehicleType, vehicleNumber, fromTime, toTime } = args;

// //       if (!fromTime || !toTime) {
// //         throw new Error("Time required");
// //       }

// //       const start = new Date(fromTime);
// //       const end = new Date(toTime);

// //       if (isNaN(start) || isNaN(end)) {
// //         throw new Error("Invalid Date format");
// //       }

// //       if (start < new Date()) {
// //         throw new Error("Cannot book past time");
// //       }

// //       const hours = (end - start) / (1000 * 60 * 60);
// //       if (hours <= 0) throw new Error("Invalid time range");
// //       if (hours > 24) throw new Error("Max booking 24 hours");

// //       if (!["car", "bike"].includes(vehicleType)) {
// //         throw new Error("Invalid vehicle type");
// //       }

// //       const regex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
// //       if (!regex.test(vehicleNumber)) {
// //         throw new Error("Invalid vehicle number");
// //       }

// //       // user active booking check
// //       const activeBooking = await Booking.findOne({
// //         user: userId,
// //         toTime: { $gt: new Date() },
// //         entryStatus: { $ne: "EXITED" }
// //       });

// //       if (activeBooking) {
// //         throw new Error("You already have an active booking");
// //       }

// //       const session = await mongoose.startSession();
// //       session.startTransaction();

// //       try {
// //         const slot = await ParkingSlot.findById(slotId).session(session);
// //         if (!slot) throw new Error("Slot not found");

// //         const overlapping = await Booking.findOne({
// //           slot: slotId,
// //           $or: [
// //             { fromTime: { $lt: end }, toTime: { $gt: start } }
// //           ]
// //         }).session(session);

// //         if (overlapping) {
// //           throw new Error("Slot already booked for this time");
// //         }

// //         const rate = vehicleType === "car" ? 50 : 20;
// //         const amount = Math.ceil(hours) * rate;

// //         const qrToken = crypto.randomBytes(16).toString("hex");

// //         await Booking.create([{
// //           user: userId,
// //           slot: slotId,
// //           vehicleType,
// //           vehicleNumber,
// //           fromTime: start,
// //           toTime: end,
// //           amount,
// //           qrToken,
// //           entryStatus: "PENDING"
// //         }], { session });

// //         await session.commitTransaction();

// //         return {
// //           message: "Booking Successful",
// //           qrToken
// //         };

// //       } catch (err) {
// //         await session.abortTransaction();
// //         throw err;
// //       } finally {
// //         session.endSession();
// //       }
// //     },

// //     // ================= ENTRY =================

// //     verifyBookingByToken: async (_, { token }) => {
// //       const booking = await Booking.findOne({ qrToken: token })
// //         .populate("slot")
// //         .populate("user");

// //       if (!booking) throw new Error("Invalid QR Code");

// //       if (booking.entryStatus === "ENTERED") {
// //         throw new Error("Already entered");
// //       }

// //       if (booking.entryStatus === "EXITED") {
// //         throw new Error("Booking already completed");
// //       }

// //       if (new Date() > booking.toTime) {
// //         throw new Error("Booking expired");
// //       }

// //       if (booking.slot.isOccupied) {
// //         throw new Error("Slot currently occupied");
// //       }

// //       booking.entryStatus = "ENTERED";
// //       await booking.save();

// //       booking.slot.isOccupied = true;
// //       await booking.slot.save();

// //       return booking;
// //     },

// //     // ================= EXIT =================

// //     exitParking: async (_, { token }) => {
// //       const booking = await Booking.findOne({ qrToken: token })
// //         .populate("slot");

// //       if (!booking) throw new Error("Invalid booking");

// //       if (booking.entryStatus === "EXITED") {
// //         throw new Error("Already exited");
// //       }

// //       if (booking.entryStatus !== "ENTERED") {
// //         throw new Error("Vehicle not entered yet");
// //       }

// //       booking.entryStatus = "EXITED";
// //       await booking.save();

// //       booking.slot.isOccupied = false;
// //       await booking.slot.save();

// //       return { message: "Exit successful" };
// //     }

// //   }
// // };















// const mongoose = require("mongoose");
// const User = require("../models/User");
// const ParkingSlot = require("../models/ParkingSlot");
// const Booking = require("../models/Booking");
// const generateOTP = require("../utils/generateOTP");
// const sendOTP = require("../utils/sendOTP");
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");

// // Helper: Get Logged-in User ID
// const getUserId = (req) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     throw new Error("Unauthorized");
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     return decoded.id;
//   } catch {
//     throw new Error("Invalid or Expired Token");
//   }
// };

// module.exports = {
//   Query: {
//     // ================= DASHBOARD =================
//     dashboardStats: async () => {
//       const totalSlots = await ParkingSlot.countDocuments();
//       const occupiedSlots = await ParkingSlot.countDocuments({ isOccupied: true });
//       const totalBookings = await Booking.countDocuments();
//       const totalCars = await Booking.countDocuments({ vehicleType: "car" });
//       const totalBikes = await Booking.countDocuments({ vehicleType: "bike" });

//       const startOfDay = new Date();
//       startOfDay.setHours(0, 0, 0, 0);

//       const endOfDay = new Date();
//       endOfDay.setHours(23, 59, 59, 999);

//       const todayBookings = await Booking.countDocuments({
//         fromTime: { $gte: startOfDay, $lte: endOfDay }
//       });

//       return {
//         totalSlots,
//         occupiedSlots,
//         totalBookings,
//         totalCars,
//         totalBikes,
//         todayBookings,
//         todayDate: new Date().toLocaleDateString("en-GB")
//       };
//     },

//     bookingAnalytics: async () => {
//       const analytics = await Booking.aggregate([
//         {
//           $group: {
//             _id: { $dateToString: { format: "%Y-%m-%d", date: "$fromTime" } },
//             count: { $sum: 1 }
//           }
//         },
//         { $sort: { _id: 1 } }
//       ]);

//       return analytics.map(item => ({ date: item._id, count: item.count }));
//     },

//     availableSlots: async (_, { fromTime, toTime }) => {
//       if (!fromTime || !toTime) throw new Error("Time required");

//       const start = new Date(fromTime);
//       const end = new Date(toTime);

//       const bookedSlots = await Booking.find({
//         $or: [
//           { fromTime: { $lt: end }, toTime: { $gt: start } }
//         ]
//       }).distinct("slot");

//       return await ParkingSlot.find({ _id: { $nin: bookedSlots } });
//     },

//     myBookings: async (_, __, { req }) => {
//       const userId = getUserId(req);
//       return await Booking.find({ user: userId })
//         .populate("slot")
//         .sort({ createdAt: -1 });
//     },

//     bookingsByEmail: async (_, { email }) => {
//       const user = await User.findOne({ email });
//       if (!user) throw new Error("User not found");

//       return await Booking.find({ user: user._id })
//         .populate("slot")
//         .sort({ createdAt: -1 });
//     },

//     scanBookings: async (_, __, { req }) => {
//       const userId = getUserId(req);
//       return await Booking.find({ user: userId })
//         .populate("slot")
//         .sort({ createdAt: -1 });
//     }
//   },

//   Mutation: {
//     // ================= AUTH =================
//     register: async (_, { username, email }) => {
//       const userExist = await User.findOne({ email });
//       if (userExist) throw new Error("User already exists");

//       await User.create({ username, email });
//       return { message: "Registered successfully" };
//     },

//     login: async (_, { email }) => {
//       const user = await User.findOne({ email });
//       if (!user) throw new Error("Invalid Email");

//       const otp = generateOTP();
//       user.otp = otp;
//       user.otpAttempts = 0;
//       user.otpExpiry = Date.now() + 5 * 60 * 1000;
//       await user.save();

//       await sendOTP(email, otp);
//       return { message: "OTP sent to email" };
//     },

//     verifyOTP: async (_, { email, otp }) => {
//       const user = await User.findOne({ email });
//       if (!user) throw new Error("Invalid request");

//       if (user.otpAttempts >= 5) throw new Error("Too many attempts");
//       if (user.otp !== otp || user.otpExpiry < Date.now()) {
//         user.otpAttempts += 1;
//         await user.save();
//         throw new Error("Invalid or expired OTP");
//       }

//       user.otp = null;
//       user.otpExpiry = null;
//       user.otpAttempts = 0;
//       user.isEmailVerified = true;
//       await user.save();

//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
//       return { message: "Auth successful", token };
//     },

//     // ================= BOOKING =================
//     createBooking: async (_, args, { req }) => {
//       const userId = getUserId(req);
//       const { slotId, vehicleType, vehicleNumber, fromTime, toTime } = args;

//       if (!fromTime || !toTime) throw new Error("Time required");

//       const start = new Date(fromTime);
//       const end = new Date(toTime);
//       if (isNaN(start) || isNaN(end)) throw new Error("Invalid Date format");
//       if (start < new Date()) throw new Error("Cannot book past time");

//       const hours = (end - start) / (1000 * 60 * 60);
//       if (hours <= 0) throw new Error("Invalid time range");
//       if (hours > 24) throw new Error("Max booking 24 hours");

//       if (!["car", "bike"].includes(vehicleType)) throw new Error("Invalid vehicle type");

//       const regex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
//       if (!regex.test(vehicleNumber)) throw new Error("Invalid vehicle number");

//       const activeBooking = await Booking.findOne({
//         user: userId,
//         toTime: { $gt: new Date() },
//         entryStatus: { $ne: "EXITED" }
//       });
//       if (activeBooking) throw new Error("You already have an active booking");

//       const session = await mongoose.startSession();
//       session.startTransaction();

//       try {
//         const slot = await ParkingSlot.findById(slotId).session(session);
//         if (!slot) throw new Error("Slot not found");

//         const overlapping = await Booking.findOne({
//           slot: slotId,
//           $or: [{ fromTime: { $lt: end }, toTime: { $gt: start } }]
//         }).session(session);

//         if (overlapping) throw new Error("Slot already booked for this time");

//         const rate = vehicleType === "car" ? 50 : 20;
//         const amount = Math.ceil(hours) * rate;
//         const qrToken = crypto.randomBytes(16).toString("hex");

//         await Booking.create([{
//           user: userId,
//           slot: slotId,
//           vehicleType,
//           vehicleNumber,
//           fromTime: start,
//           toTime: end,
//           amount,
//           qrToken,
//           entryStatus: "PENDING"
//         }], { session });

//         await session.commitTransaction();
//         return { message: "Booking Successful", qrToken };
//       } catch (err) {
//         await session.abortTransaction();
//         throw err;
//       } finally {
//         session.endSession();
//       }
//     },

//     // ================= ENTRY =================
//     verifyBookingByToken: async (_, { token }) => {
//       const booking = await Booking.findOne({ qrToken: token })
//         .populate("slot")
//         .populate("user");

//       if (!booking) throw new Error("Invalid QR Code");
//       if (booking.entryStatus === "ENTERED") throw new Error("Already entered");
//       if (booking.entryStatus === "EXITED") throw new Error("Booking already completed");
//       if (new Date() > booking.toTime) throw new Error("Booking expired");
//       if (booking.slot.isOccupied) throw new Error("Slot currently occupied");

//       booking.entryStatus = "ENTERED";
//       await booking.save();

//       booking.slot.isOccupied = true;
//       await booking.slot.save();

//       return booking;
//     },

//     // ================= EXIT =================
//     exitParking: async (_, { token }) => {
//       const booking = await Booking.findOne({ qrToken: token }).populate("slot");
//       if (!booking) throw new Error("Invalid booking");

//       if (booking.entryStatus === "EXITED") throw new Error("Already exited");
//       if (booking.entryStatus !== "ENTERED") throw new Error("Vehicle not entered yet");

//       booking.entryStatus = "EXITED";
//       await booking.save();

//       booking.slot.isOccupied = false;
//       await booking.slot.save();

//       return { message: "Exit successful" };
//     }
//   }
// };










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

    exitParking: async (_, { token }, { req }) => {
      const booking = await Booking.findOne({ qrToken: token });
      if (!booking) throw new Error("Invalid QR Code");

      booking.entryStatus = "EXITED";
      await booking.save();

      const slot = await ParkingSlot.findById(booking.slot);
      slot.isOccupied = false;
      await slot.save();

      return { message: "Exited successfully" };
    }

  }
};