require("dotenv").config();
const mongoose = require("mongoose");
const ParkingSlot = require("../models/ParkingSlot");
const Booking = require("../models/Booking");
const User = require("../models/User");

mongoose.connect(process.env.MONGO_URI);

async function seed() {

    await ParkingSlot.deleteMany();
    await Booking.deleteMany();
    await User.deleteMany();

    // -------------------------
    // 1️⃣ Create Users
    // -------------------------
    const users = await User.insertMany([
        { name: "Rahul", email: "rahul@test.com", password: "123" },
        { name: "Aman", email: "aman@test.com", password: "123" },
        { name: "Priya", email: "priya@test.com", password: "123" },
        { name: "Neha", email: "neha@test.com", password: "123" }
    ]);

    // -------------------------
    // 2️⃣ Create Slots
    // -------------------------
    const slots = [];

    for (let i = 1; i <= 20; i++) {
        slots.push({ slotNumber: `A${i}`, type: "car", isOccupied: false });
    }

    for (let i = 1; i <= 10; i++) {
        slots.push({ slotNumber: `B${i}`, type: "bike", isOccupied: false });
    }

    const insertedSlots = await ParkingSlot.insertMany(slots);

    // -------------------------
    // 3️⃣ Create Bookings (Analytics Friendly)
    // -------------------------
    const bookings = [];

    for (let i = 0; i < 300; i++) {

        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomSlot = insertedSlots[Math.floor(Math.random() * insertedSlots.length)];

        const randomDay = Math.floor(Math.random() * 30);
        const startHour = Math.floor(Math.random() * 12) + 8; // 8am–8pm
        const duration = Math.floor(Math.random() * 4) + 1; // 1–4 hrs

        const from = new Date();
        from.setDate(from.getDate() - randomDay);
        from.setHours(startHour, 0, 0);

        const to = new Date(from);
        to.setHours(from.getHours() + duration);

        bookings.push({
            user: randomUser._id,
            slot: randomSlot._id,
            vehicleType: randomSlot.type,
            fromTime: from,
            toTime: to,
            amount: duration * 50
        });
    }

    await Booking.insertMany(bookings);

    console.log(" Analytics Ready Seed Inserted");
    process.exit();
}

seed();
