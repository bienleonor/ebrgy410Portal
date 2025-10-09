import {
  createResident,
  getResidentByUserId,
  updateResident,
  deleteResidentById,
  getResidentByIdFromDB,
  getAllResidents,
} from "../models/residentModel.js";

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
