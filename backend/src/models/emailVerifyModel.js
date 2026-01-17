import pool from "../config/pool.js";

// Create a verification record if not exists
export async function upsertEmailVerification(verified_id, email) {
  const [existing] = await pool.query(
    `SELECT * FROM email_verifications WHERE verified_id = ?`,
    [verified_id]
  );

  if (existing.length > 0) {
    // Update otp_verified_at if OTP just verified
    await pool.query(
      `UPDATE email_verifications SET otp_verified_at = NOW(), date_updated = NOW() WHERE verified_id = ?`,
      [verified_id]
    );
    return existing[0].id;
  }

  // Insert new record
  const [result] = await pool.query(
    `INSERT INTO email_verifications (verified_id, email, otp_verified_at, date_created, date_updated)
     VALUES (?, ?, NOW(), NOW(), NOW())`,
    [verified_id, email]
  );

  return result.insertId;
}

// Mark OTP as verified
export async function markOtpVerified(verified_id) {
  await pool.query(
    `INSERT INTO email_verifications (verified_id, otp_verified_at, date_created, date_updated)
     VALUES (?, NOW(), NOW(), NOW())
     ON DUPLICATE KEY UPDATE otp_verified_at = NOW(), date_updated = NOW()`,
    [verified_id]
  );
}

// Mark account creation
export async function markAccountCreated(verified_id) {
  await pool.query(
    `UPDATE email_verifications SET account_created_at = NOW(), date_updated = NOW() WHERE verified_id = ?`,
    [verified_id]
  );
}

// Get verification record
export async function getEmailVerification(verified_id) {
  const [rows] = await pool.query(
    `SELECT * FROM email_verifications WHERE verified_id = ?`,
    [verified_id]
  );
  return rows[0];
}