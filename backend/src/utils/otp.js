// utils/otp.js
import crypto from "crypto";

/**
 * Generate an alphanumeric OTP
 * @param {number} length - length of the OTP
 * @returns {string} - OTP string
 */
export function generateOtp(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let otp = "";

  // Generate OTP securely
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    otp += chars[randomIndex];
  }

  return otp;
}
