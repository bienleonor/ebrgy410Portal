import pool from "../config/pool.js";
import bcrypt from "bcrypt";

const OTP_EXPIRY_MINUTES = 5;

// Save OTP
export async function saveOtp(verified_id, otp) {
  const hashedOtp = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

  await pool.query(
    `INSERT INTO email_otps (verified_id, otp_hash, expiration, used) VALUES (?, ?, ?, 0)`,
    [verified_id, hashedOtp, expiresAt]
  );
}

// Verify OTP
export async function verifyOtp(verified_id, otp) {
  const [rows] = await pool.query(
    `SELECT * FROM email_otps WHERE verified_id = ? AND used = 0 ORDER BY expiration DESC LIMIT 1`,
    [verified_id]
  );

  if (!rows.length) return false;

  const record = rows[0];
  const now = new Date();
  if (now > record.expiration) return false;

  const match = await bcrypt.compare(otp, record.otp_hash);
  if (!match) return false;

  // Mark OTP as used
  await pool.query(`UPDATE email_otps SET used = 1 WHERE otp_id = ?`, [record.otp_id]);

  return true;
}