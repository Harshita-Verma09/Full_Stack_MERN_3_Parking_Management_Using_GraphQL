import { useEffect, useState } from "react";
import "../styles/booking.css";

export default function Booking({ refreshDashboard }) {

    const [slots, setSlots] = useState([]);
    const token = sessionStorage.getItem("token");

    //  Fetch Available Slots
    const fetchSlots = async () => {
        try {
            const res = await fetch("http://localhost:5000/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    query: `
                        query {
                            availableSlots {
                                id
                                slotNumber
                                type
                            }
                        }
                    `
                })
            });

            const data = await res.json();

            if (data.errors) {

                alert("Authentication Failed. Please login again.");
                return;
            }

            setSlots(data.data.availableSlots || []);
        } catch (error) {
            console.error("Fetch Slots Error:", error);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    //  Handle Booking
    const handleBooking = async (e) => {
        e.preventDefault();

        const form = e.target;

        try {
            const res = await fetch("http://localhost:5000/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    query: `
                        mutation CreateBooking(
                            $slotId: ID!,
                            $vehicleType: String!,
                            $vehicleNumber: String!,
                            $fromTime: String!,
                            $toTime: String!
                        ) {
                            createBooking(
                                slotId:$slotId,
                                vehicleType:$vehicleType,
                                vehicleNumber:$vehicleNumber,
                                fromTime:$fromTime,
                                toTime:$toTime
                            )
                        }
                    `,
                    variables: {
                        slotId: form.slot.value,
                        vehicleType: form.vehicleType.value,
                        vehicleNumber: form.vehicleNumber.value,
                        fromTime: form.fromTime.value,
                        toTime: form.toTime.value
                    }
                })
            });

            const data = await res.json();


            if (data.errors) {

                alert(data.errors[0].message);
                return;
            }

            if (data.data?.createBooking) {
                alert("Booking Done!");

                if (refreshDashboard) {
                    refreshDashboard();
                }

                fetchSlots();
                form.reset();
            } else {
                alert("Booking Failed!");
            }

        } catch (error) {

            alert("Something went wrong!");
        }
    };

    return (
        <div className="booking-page">
            <h1 className="booking-title">Book Parking Slot</h1>

            <form onSubmit={handleBooking} className="booking-form">

                <select name="slot" required>
                    <option value="">Select Slot</option>
                    {slots.map(slot => (
                        <option key={slot.id} value={slot.id}>
                            {slot.slotNumber} ({slot.type})
                        </option>
                    ))}
                </select>

                <select name="vehicleType" required>
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                </select>

                <input name="vehicleNumber" placeholder="Vehicle Number" required />
                <input type="datetime-local" name="fromTime" required />
                <input type="datetime-local" name="toTime" required />

                <button type="submit">Book Now</button>

            </form>
        </div>
    );
}
