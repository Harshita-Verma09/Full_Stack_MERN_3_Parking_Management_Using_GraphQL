
// const { gql } = require("apollo-server-express");

// module.exports = gql`

//   type User {
//     id: ID
//     username: String
//     email: String
//     isEmailVerified: Boolean
//   }

//   type Message {
//     message: String
//   }

//   type AuthResponse {
//     message: String
//     token: String
//   }

//   type DashboardStats {
//     totalSlots: Int
//     occupiedSlots: Int
//     totalBookings: Int
//     totalCars: Int
//     totalBikes: Int
//     todayBookings: Int
//     todayDate: String
//   }

//   type BookingAnalytics {
//     date: String
//     count: Int
//   }

//   type ParkingSlot {
//     id: ID
//     slotNumber: String
//     type: String
//     isOccupied: Boolean
//   }

//  type Booking {
//   id: ID
//   vehicleType: String
//   vehicleNumber: String
//   fromTime: String
//   toTime: String
//   amount: Float
//   entryStatus: String
//   qrToken: String
//   slot: ParkingSlot
// }


//   type BookingResponse {
//     message: String
//     qrToken: String
//   }

//   type Query {
//     dashboardStats: DashboardStats
//     bookingAnalytics: [BookingAnalytics]
//      availableSlots(fromTime: String!, toTime: String!): [ParkingSlot]
//     myBookings: [Booking]
//     scanBookings: [Booking]

//     scanBookingsByEmail(email: String!): [Booking]
//     bookingsByEmail(email: String!): [Booking]
//   }

//   type Mutation {
//     register(username: String!, email: String!): Message
//     login(email: String!): Message
//     verifyOTP(email: String!, otp: String!): AuthResponse

//     createBooking(
//       slotId: ID!
//       vehicleType: String!
//       vehicleNumber: String!
//       fromTime: String!
//       toTime: String!
//     ): BookingResponse

//     verifyBookingByToken(token: String!): Booking
//     exitParking(token: String!): Message
//   }


// `;








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
  entryStatus: String
  qrToken: String
  slot: ParkingSlot
}


  type BookingResponse {
    message: String
    qrToken: String
  }

  type Query {
    dashboardStats: DashboardStats
    bookingAnalytics: [BookingAnalytics]
    availableSlots: [ParkingSlot]
    myBookings: [Booking]
    scanBookings: [Booking]

    scanBookingsByEmail(email: String!): [Booking]
    bookingsByEmail(email: String!): [Booking]
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
    ): BookingResponse

    verifyBookingByToken(token: String!): Booking
    exitParking(token: String!): Message
  }

`;