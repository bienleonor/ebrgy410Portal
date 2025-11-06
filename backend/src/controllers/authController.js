import bcrypt from "bcryptjs";
import pool from "../config/pool.js";
import { findUserByUsername, createUser } from "../models/User.js";
import { findRoleNameById } from "../models/RoleModel.js";
import { generateToken } from "../utils/generateToken.js";

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
        JOIN residents r ON bo.resident_id = r.resident_id
        JOIN positions p ON bo.position_id = p.position_id
        WHERE r.user_id = ?
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