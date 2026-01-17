// utils/sendOtpEmail.js
import { transporter } from "../config/mail.js";

export async function sendOtpEmail(to, otp) {
  await transporter.sendMail({
    from: `"E-Barangay 410 Web Portal" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your One-Time Password (OTP) code",
    html: `
      <p>Your One-Time Password (OTP) is:</p>
      <h2>${otp}</h2>
      <p>This code will expire in 5 minutes.</p>
      <p>If you did not request this, ignore this email.</p>
    `,
  });
}