///home/harshita-verma/Documents/CODE_FOCUS/MERN_Parking_Sys/frontend/src/graphql/queries.js


import { gql } from "@apollo/client";

export const GET_BOOKINGS = gql`
  query GetBookings {
    scanBookings {
      id
      fromTime
      toTime
      slot {
        slotNumber
      }
    }
  }
`;

// Naya query QR token ke liye
export const GET_BOOKING_BY_QR = gql`
  query GetBookingByQR($qrToken: String!) {
    bookingByQR(qrToken: $qrToken) {
      slot {
        slotNumber
      }
      vehicleType
      vehicleNumber
      fromTime
      toTime
      amount
      entryStatus
    }
  }
`;

