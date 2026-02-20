
const { gql } = require("apollo-server-express");

module.exports = gql`

  type User {
    id: ID
    username: String
    email: String
    isEmailVerified: Boolean
  }

  type Message {
    message: String
  }

  type AuthResponse {
    message: String
    token: String
  }

  type DashboardStats {
    totalSlots: Int
    occupiedSlots: Int
    totalBookings: Int
    totalCars: Int
    totalBikes: Int
    todayBookings: Int
    todayDate: String
  }

  type BookingAnalytics {
    date: String
    count: Int
  }

  type ParkingSlot {
    id: ID
    slotNumber: String
    type: String
    isOccupied: Boolean
  }

  type Booking {
    id: ID
    vehicleType: String
    vehicleNumber: String
    fromTime: String
    toTime: String
    amount: Float
    status: String
  }

  type Query {
    dashboardStats: DashboardStats
    bookingAnalytics: [BookingAnalytics]
    availableSlots: [ParkingSlot]
    myBookings: [Booking]
  }

  type Mutation {
    register(username: String!, email: String!): Message
    login(email: String!): Message
    verifyOTP(email: String!, otp: String!): AuthResponse
    createBooking(
      slotId: ID!
      vehicleType: String!
      vehicleNumber: String!
      fromTime: String!
      toTime: String!
    ): String
  }

`;
