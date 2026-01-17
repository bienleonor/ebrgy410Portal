import bcrypt from "bcryptjs";
import pool from "../config/pool.js";
import { findUserByUsername, createUser, createUserFromVerifiedConstituent, checkUsernameExists } from "../models/User.js";
import { findRoleNameById } from "../models/RoleModel.js";
import { generateToken } from "../utils/generateToken.js";
import { markAccountCreated, getEmailVerification, markOtpVerified } from "../models/emailVerifyModel.js";
import { saveOtp, verifyOtp } from "../models/otpModel.js";
import { generateOtp } from "../utils/otp.js";
import verifiedConstituentModel from "../models/verifiedConstituentModel.js";
import { transporter } from "../config/mail.js";

const roleMap = {
  1: "SuperAdmin",
  2: "Admin",
  3: "Resident",
};

// 🧠 SIGNUP CONTROLLER
export const signup = async (req, res) => {
  try {
    let { username, password, email, role } = req.body;

    role = parseInt(role, 10);
    if (!role || isNaN(role) || !roleMap[role]) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const [roleExists] = await pool.execute("SELECT role_id FROM role WHERE role_id = ?", [role]);
    if (roleExists.length === 0) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) return res.status(400).json({ message: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await createUser({
      username,
      password: hashedPassword,
      email,
      role,
    });

    res.status(201).json({ message: "Account created successfully", userId });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🧠 CHECK VERIFIED CONSTITUENT (Step 1: Check if user exists in verified_constituent)
export const checkVerifiedConstituent = async (req, res) => {
  try {
    const { first_name, last_name, birthdate } = req.body;

    if (!first_name || !last_name || !birthdate) {
      return res.status(400).json({ message: "First name, last name, and birthdate are required" });
    }

    const constituent = await verifiedConstituentModel.findByPersonalInfo(first_name, last_name, birthdate);

    if (!constituent) {
      return res.status(404).json({ message: "No verified constituent found with the provided information" });
    }

    if (!constituent.email) {
      return res.status(400).json({ message: "No email registered for this constituent" });
    }

    res.json({
      message: "Verified constituent found",
      verified_id: constituent.verified_id,
      email: constituent.email,
      name: `${constituent.first_name} ${constituent.last_name}`
    });
  } catch (error) {
    console.error("Check constituent error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🧠 SEND OTP (Step 2: Send OTP to email)
export const sendOTP = async (req, res) => {
  try {
    const { verified_id } = req.body;

    if (!verified_id) {
      return res.status(400).json({ message: "verified_id is required" });
    }

    // Get constituent info
    const constituent = await verifiedConstituentModel.getById(verified_id);
    if (!constituent) {
      return res.status(404).json({ message: "Verified constituent not found" });
    }

    if (!constituent.email) {
      return res.status(400).json({ message: "No email registered for this constituent" });
    }

    // Generate OTP
    const otp = generateOtp(6);

    // Save OTP (hashed in database)
    await saveOtp(verified_id, otp);

    // Send OTP email
    await transporter.sendMail({
      from: `"Barangay System" <${process.env.SMTP_USER}>`,
      to: constituent.email,
      subject: "Your OTP Code for Account Creation",
      html: `
        <h2>Account Creation OTP</h2>
        <p>Hello ${constituent.first_name},</p>
        <p>Your OTP code is: <strong style="font-size: 24px; color: #007bff;">${otp}</strong></p>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// 🧠 VERIFY OTP (Step 3: Verify the OTP code)
export const verifyOTP = async (req, res) => {
  try {
    const { verified_id, otp } = req.body;

    if (!verified_id || !otp) {
      return res.status(400).json({ message: "verified_id and otp are required" });
    }

    const isValid = await verifyOtp(verified_id, otp);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark OTP as verified in email_verifications table
    await markOtpVerified(verified_id);

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🧠 CREATE ACCOUNT FROM VERIFIED CONSTITUENT (Step 4: Create account after OTP verification)
export const createAccountFromVerified = async (req, res) => {
  try {
    const { verified_id, username, password } = req.body;

    // Validate required fields
    if (!verified_id || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if OTP has been verified
    const verification = await getEmailVerification(verified_id);
    if (!verification || !verification.otp_verified_at) {
      return res.status(400).json({ message: "Email OTP not verified yet" });
    }

    // Check if account already created
    if (verification.account_created_at) {
      return res.status(400).json({ message: "Account already created for this constituent" });
    }

    // Check if username already exists
    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create account (role is automatically Resident = 3)
    const accountId = await createUserFromVerifiedConstituent(verified_id, username, hashedPassword);

    // Mark account as created
    await markAccountCreated(verified_id);

    res.status(201).json({ message: "Account created successfully", accountId });
  } catch (error) {
    console.error("Account creation error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// 🧠 LOGIN CONTROLLER
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 🔹 Step 1: Find user by username
    const user = await findUserByUsername(username);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔹 Step 2: Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: "Invalid credentials" });

    // 🔹 Step 3: Get role name
    const roleName = await findRoleNameById(user.role_id);

    // 🔹 Step 4: Get position only if user is an Admin
    let positionName = null;

    if (roleName?.toLowerCase() === "admin") {
      const [rows] = await pool.query(
        `
        SELECT p.position_name
        FROM brgy_officials bo
        JOIN users u ON bo.verified_id = u.verified_id
        JOIN positions p ON bo.position_id = p.position_id
        WHERE u.user_id = ?
        LIMIT 1
        `,
        [user.user_id]
      );

      if (rows.length > 0) {
        positionName = rows[0].position_name;
      }
    }

    // 🔹 Step 5: Generate JWT
    const token = generateToken({
      user_id: user.user_id,
      username: user.username,
      role_name: roleName,
      position_name: positionName,
    });

    // 🔹 Step 6: Return success response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: roleName,
        position: positionName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};