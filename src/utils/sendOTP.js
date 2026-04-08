


const transporter = require("../config/mail");

// Agar aapke paas username hai toh teen variables pass karo (email, otp, username)
const sendOTP = async (email, otp, username = null) => {

    // Agar username nahi aaya toh email ka pehla part (before @) use kar lenge
    const displayName = username || email.split('@')[0];

    await transporter.sendMail({
        from: '"ParkSmart Support" <your-email@gmail.com>',
        to: email,
        subject: " Your Secure Login OTP - ParkSmart",
        text: `Hello ${displayName}, Your OTP is ${otp}. It is valid for 10 minutes.`,
        html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #080c14; padding: 40px; text-align: center; color: #ffffff;">
            <div style="max-width: 500px; margin: 0 auto; background: #0a192f; border: 1px solid #00e5ff33; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                
                <h1 style="color: #00e5ff; margin-bottom: 20px; font-size: 28px; letter-spacing: 2px;">Park<span style="color: #ffffff;">Smart</span></h1>
                
                <div style="width: 50px; height: 2px; background: #00e5ff; margin: 20px auto;"></div>
                
                <!-- Yahan ab user ka naam ya email dikhega -->
                <p style="color: #8892b0; font-size: 18px; line-height: 1.6; margin-bottom: 5px;">
                    Hello <span style="color: #ffffff; font-weight: 600;">${displayName}</span>,
                </p>
                
                <p style="color: #8892b0; font-size: 15px; line-height: 1.6; margin-top: 0;">
                    Use the following One-Time Password (OTP) to securely log in to your account.
                </p>
                
                <div style="margin: 35px 0; padding: 25px; background: #000000; border-radius: 12px; border: 1px dashed #00e5ff; display: inline-block; min-width: 220px;">
                    <span style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #00e5ff; display: block; margin-left: 12px;">
                        ${otp}
                    </span>
                </div>
                
                <p style="color: #8892b0; font-size: 14px;">Valid for <b>10 minutes</b> only.</p>
                
                <p style="color: #475569; font-size: 13px; margin-top: 25px;">
                    If you didn't request this code for <span style="color: #00e5ff;">${email}</span>, please ignore this email.
                </p>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #112240;">
                    <p style="color: #475569; font-size: 11px; margin: 0;">
                        © 2026 ParkSmart Systems. All Rights Reserved.
                    </p>
                </div>
            </div>
        </div>
        `
    });
};

module.exports = sendOTP;