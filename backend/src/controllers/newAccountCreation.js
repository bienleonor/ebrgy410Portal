import { markAccountCreated, getEmailVerification } from "../models/emailVerifyModel.js";
import bcrypt from "bcrypt";
import pool from "../config/pool.js";

export async function createAccount(req, res) {
  try {
    const { verified_constituent_id, username, password } = req.body;
    if (!verified_constituent_id || !username || !password)
      return res.status(400).json({ message: "All fields are required" });

    // Check if OTP has been verified
    const verification = await getEmailVerification(verified_constituent_id);
    if (!verification || !verification.otp_verified_at)
      return res.status(400).json({ message: "OTP not verified yet" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into accounts table
    await pool.query(
      `INSERT INTO accounts (verified_constituent_id, username, password, created_at)
       VALUES (?, ?, ?, NOW())`,
      [verified_constituent_id, username, hashedPassword]
    );

    // Update account_created_at
    await markAccountCreated(verified_constituent_id);

    res.json({ message: "Account created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}