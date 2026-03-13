///home/harshita-verma/Documents/CODE_FOCUS/MERN_Parking_Sys/frontend/src/components/QRCodeGenerator.jsx


import QRCode from "react-qr-code";

export default function QRCodeGenerator() {

    const qrData = "http://localhost:5173/scan?email=test@gmail.com";

    return (
        <div style={{ textAlign: "center", marginTop: "40px" }}>

            <h2>Parking Booking QR</h2>

            <QRCode value={qrData} size={350} />

            <p>Scan this QR with your phone</p>

        </div>
    );
}
