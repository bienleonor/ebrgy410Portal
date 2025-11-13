import {
  createResident,
  getResidentByUserId,
  updateResident,
  deleteResidentById,
  getResidentByIdFromDB,
  getAllResidents,
} from "../models/residentModel.js";
import bcrypt from "bcryptjs"; // Add this import at the top


export const createResidentWithAccount = async (req, res) => {
  const { username, email, password, role_name, first_name, middle_name, last_name, gender, address_id, contact_number, is_voter } = req.body;

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    // 1️⃣ Create user account
    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult] = await conn.execute(
      `INSERT INTO users (username, email, password, role_name) VALUES (?, ?, ?, ?)`,
      [username, email, hashedPassword, role_name || "resident"]
    );
    const user_id = userResult.insertId;

    // 2️⃣ Create resident profile linked to that user_id
    await conn.execute(
      `INSERT INTO residents 
       (user_id, first_name, middle_name, last_name, gender, address_id, contact_number, is_voter, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [user_id, first_name, middle_name || null, last_name, gender, address_id, contact_number, is_voter || 0]
    );

    await conn.commit();
    res.status(201).json({ message: "Resident and account created successfully" });
  } catch (error) {
    await conn.rollback();
    console.error("Error creating resident with account:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    conn.release();
  }
};



// ✅ For resident users
export const addResident = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = { ...req.body, user_id: userId };

    const result = await createResident(data);
    res.status(201).json({
      message: "Resident profile created successfully",
      resident_id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getMyResidentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getResidentByUserId(userId);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateMyResidentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    await updateResident(userId, data);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Admin route: Delete any resident
export const deleteResident = async (req, res) => {
  try {
    const result = await deleteResidentById(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Resident not found" });
    }

    res.json({ message: "Resident deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Admin route: Get resident by ID
export const getResidentById = async (req, res) => {
  try {
    const resident = await getResidentByIdFromDB(req.params.id);

    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }

    res.json(resident);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Admin route: Get all residents
export const listAllResidents = async (req, res) => {
  try {
    const residents = await getAllResidents();
    res.json(residents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
