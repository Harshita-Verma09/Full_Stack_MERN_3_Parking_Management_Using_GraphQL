const transporter = require("../config/mail");

const sendOTP = async (email, otp) => {
    await transporter.sendMail({
        from: "Parking App",
        to: email,
        subject: "Your Login OTP",
        text: `Your OTP is ${otp}`
    });
};

module.exports = sendOTP;

