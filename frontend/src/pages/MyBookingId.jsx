
import { useEffect, useState } from "react";

export default function MyBookingId() {

    const [bookings, setBookings] = useState([]);
    const token = sessionStorage.getItem("token");

    const formatDate = (time) => {
        if (!time) return "Invalid Time";

        const date = new Date(Number(time) || time);

        if (isNaN(date.getTime())) return "Invalid Time";

        return date.toLocaleString();
    };

    const isPastBooking = (time) => {
        if (!time) return false;

        const bookingDate = new Date(Number(time) || time);
        const today = new Date();

        return bookingDate < today;
    };

    const fetchMyBookings = async () => {
        try {
            const res = await fetch("http://localhost:5000/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    query: `
            query {
              myBookings {
                id
                vehicleNumber
                vehicleType
                fromTime
                toTime
                qrToken
                slot {
                  slotNumber
                }
              }
            }
          `
                })
            });

            const data = await res.json();

            if (data.errors) {
                alert(data.errors[0].message);
                return;
            }

            setBookings(data.data.myBookings);

        } catch (err) {
            console.log("Fetch Error:", err);
        }
    };

    useEffect(() => {
        fetchMyBookings();
    }, []);

    if (bookings.length === 0) {
        return <h2>No Booking Found</h2>;
    }

    return (
        <div>

            <h2>My Booking ID</h2>

            {bookings.map((b) => (
                <div
                    key={b.id}
                    style={{
                        border: "1px solid #ccc",
                        padding: "15px",
                        margin: "10px",
                        borderRadius: "8px"
                    }}
                >

                    <p><b>Vehicle:</b> {b.vehicleNumber}</p>
                    <p><b>Type:</b> {b.vehicleType}</p>
                    <p><b>Slot:</b> {b.slot?.slotNumber}</p>

                    <p>
                        <b>From:</b> {formatDate(b.fromTime)}
                    </p>

                    <p>
                        <b>To:</b> {formatDate(b.toTime)}
                    </p>

                    {/* Booking ID only if booking is NOT past */}
                    {!isPastBooking(b.toTime) && (
                        <p>
                            <b>Booking ID:</b> {b.qrToken}
                        </p>
                    )}

                </div>
            ))}

        </div>
    );
}













// import { useEffect, useState } from "react";

// export default function MyBookingId() {

//     const [bookings, setBookings] = useState([]);

//     const token = sessionStorage.getItem("token");
//     console.log("TOKEN:", token); // 🔍 token check

//     const formatDate = (time) => {
//         console.log("Formatting Time:", time); // 🔍 time check

//         if (!time) return "Invalid Time";

//         const date = new Date(Number(time) || time);

//         if (isNaN(date.getTime())) return "Invalid Time";

//         return date.toLocaleString();
//     };

//     const isPastBooking = (time) => {
//         console.log("Check Past Booking:", time); // 🔍 past booking check

//         if (!time) return false;

//         const bookingDate = new Date(Number(time) || time);
//         const today = new Date();

//         return bookingDate < today;
//     };

//     const fetchMyBookings = async () => {

//         console.log("Fetching bookings...");

//         try {
//             const res = await fetch("http://localhost:5000/graphql", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                     query: `
//             query {
//               myBookings {
//                 id
//                 vehicleNumber
//                 vehicleType
//                 fromTime
//                 toTime
//                 qrToken
//                 slot {
//                   slotNumber
//                 }
//               }
//             }
//           `
//                 })
//             });

//             console.log("Response Status:", res.status); // 🔍 status check

//             const data = await res.json();

//             console.log("GraphQL Response:", data); // 🔍 full response check

//             if (data.errors) {
//                 console.log("GraphQL Error:", data.errors);
//                 alert(data.errors[0].message);
//                 return;
//             }

//             console.log("Bookings Data:", data.data.myBookings); // 🔍 bookings check

//             setBookings(data.data.myBookings);

//         } catch (err) {
//             console.log("Fetch Error:", err);
//         }
//     };

//     useEffect(() => {
//         fetchMyBookings();
//     }, []);

//     console.log("Bookings State:", bookings); // 🔍 state check

//     if (bookings.length === 0) {
//         return <h2>No Booking Found</h2>;
//     }

//     return (
//         <div>

//             <h2>My Booking ID</h2>

//             {bookings.map((b) => {

//                 console.log("Single Booking:", b); // 🔍 each booking

//                 return (
//                     <div
//                         key={b.id}
//                         style={{
//                             border: "1px solid #ccc",
//                             padding: "15px",
//                             margin: "10px",
//                             borderRadius: "8px"
//                         }}
//                     >

//                         <p><b>Vehicle:</b> {b.vehicleNumber}</p>
//                         <p><b>Type:</b> {b.vehicleType}</p>
//                         <p><b>Slot:</b> {b.slot?.slotNumber}</p>

//                         <p>
//                             <b>From:</b> {formatDate(b.fromTime)}
//                         </p>

//                         <p>
//                             <b>To:</b> {formatDate(b.toTime)}
//                         </p>

//                         {!isPastBooking(b.toTime) && (
//                             <p>
//                                 <b>Booking ID:</b> {b.qrToken}
//                             </p>
//                         )}

//                     </div>
//                 );
//             })}

//         </div>
//     );
// }
