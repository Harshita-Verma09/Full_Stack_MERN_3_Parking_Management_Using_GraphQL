

import { useQuery } from "@apollo/client/react";
import { GET_BOOKINGS } from "../graphql/queries";
import { QRCodeSVG } from "qrcode.react";

export default function ScanBookings() {

  const { loading, error, data } = useQuery(GET_BOOKINGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading bookings</p>;

  if (!data?.scanBookings?.length) {
    return <p>No bookings found</p>;
  }

  return (
    <div>
      <h2>Booking Details</h2>

      {data.scanBookings.map((booking) => {

        // Timestamp → readable date
        const fromTime = new Date(Number(booking.fromTime)).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });

        const toTime = new Date(Number(booking.toTime)).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });

        const qrData = `BOOKING DETAILS
Slot: ${booking.slot.slotNumber}
From: ${fromTime}
To: ${toTime}`;

        return (
          <div
            key={booking.id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
              textAlign: "center"
            }}
          >
            <p><strong>Slot:</strong> {booking.slot.slotNumber}</p>
            <p><strong>From:</strong> {fromTime}</p>
            <p><strong>To:</strong> {toTime}</p>

            <QRCodeSVG
              value={qrData}
              size={200}
              level="H"
              includeMargin={true}
            />

            <p style={{ fontSize: "12px", color: "#666" }}>
              Scan to see booking details
            </p>
          </div>
        );
      })}
    </div>
  );
}
