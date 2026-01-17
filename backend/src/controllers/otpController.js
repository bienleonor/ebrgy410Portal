import { generateOtp } from "../utils/otp.js";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";
import { saveOtp, verifyOtp } from "../models/otpModel.js";
import { upsertEmailVerification }from "../models/emailVerifyModel.js";

export async function sendOtp(req, res) {
  try {
    const { verified_id, email } = req.body;
    if (!verified_id || !email)
      return res.status(400).json({ message: "ID and email are required" });

    const otp = generateOtp(8); // 8-char alphanumeric
    await saveOtp(verified_id, otp);
    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function verifyOtpController(req, res) {
  try {
    const { verified_id, email, otp } = req.body;
    if (!verified_id || !otp || !email)
      return res.status(400).json({ message: "ID, email, and OTP are required" });

    const valid = await verifyOtp(verified_id, otp);
    if (!valid) return res.status(400).json({ message: "Invalid or expired OTP" });

    // Insert/update permanent verification record
    await upsertEmailVerification(verified_id, email);

    res.json({ message: "OTP verified successfully, account can now be created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
