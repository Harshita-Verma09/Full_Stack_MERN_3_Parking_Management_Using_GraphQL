export default function Help() {
  return (
    <div className="help-container">

      <h1 className="help-title">Parking System Guide</h1>

      {/* Steps */}
      <div className="help-cards">

        <div className="help-card">
          <h3>1️⃣ Open Booking Tab</h3>
          <p>Select the Booking tab from the dashboard.</p>
        </div>

        <div className="help-card">
          <h3>2️⃣ Choose Slot</h3>
          <p>Select an available parking slot and vehicle type.</p>
        </div>

        <div className="help-card">
          <h3>3️⃣ Confirm Booking</h3>
          <p>Confirm your booking to reserve the parking slot.</p>
        </div>

        <div className="help-card">
          <h3>4️⃣ View Booking ID</h3>
          <p>Go to the <b>My Booking ID</b> tab to see your booking QR.</p>
        </div>

        <div className="help-card">
          <h3>5️⃣ Scan QR at Gate</h3>
          <p>Show your QR code at the parking gate for verification.</p>
        </div>

        <div className="help-card">
          <h3>6️⃣ Exit Parking</h3>
          <p>When leaving the parking area, scan your QR again to close the booking.</p>
        </div>

      </div>

      {/* Important Notes */}
      <div className="help-box">
        <h2>Important Notes</h2>

        <ul>
          <li>Always keep your QR code ready before entering parking.</li>
          <li>Your booking is valid only for the selected time slot.</li>
          <li>If the parking is full, please wait for a free slot.</li>
          <li>Make sure your internet connection is active while booking.</li>
        </ul>
      </div>

      {/* WARNING SECTION */}
      <div className="help-warning">
        <h2>⚠ Important Restrictions</h2>

        <ul>
          <li>You can request OTP only <b>3 times</b> for verification.</li>
          <li>Your QR code can be scanned only <b>3 times</b> per booking.</li>
          <li>If the limit is exceeded, the booking may be temporarily blocked.</li>
        </ul>
      </div>

      {/* Contact */}
      <div className="help-contact">
        <h2>Need Help?</h2>
        <p>Email: <b>parking-support@example.com</b></p>
        <p>Support Time: 9 AM – 6 PM</p>
      </div>

    </div>
  );
}
