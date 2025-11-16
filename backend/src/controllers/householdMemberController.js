// src/controllers/householdMemberController.js
import {
  addHouseholdMember,
  updateHouseholdMember,
  removeHouseholdMember,
  deleteHouseholdMember,
  getHouseholdMemberById,
  transferHouseholdMember
} from "../models/householdMemberModel.js";

/**
 * Add member to household
 */
export const addMemberController = async (req, res) => {
  try {
    const { household_id, resident_id, role_in_household } = req.body;

    if (!household_id || !resident_id || !role_in_household) {
      return res.status(400).json({ 
        message: "Household ID, Resident ID, and Role are required" 
      });
    }

    const memberId = await addHouseholdMember({
      household_id,
      resident_id,
      role_in_household
    });

    res.status(201).json({
      message: "Member added to household successfully",
      member_id: memberId
    });
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(400).json({ 
      message: error.message || "Failed to add member" 
    });
  }
};

/**
 * Update member role
 */
export const updateMemberController = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_in_household } = req.body;

    if (!role_in_household) {
      return res.status(400).json({ message: "Role is required" });
    }

    const updated = await updateHouseholdMember(id, role_in_household);

    if (!updated) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({ message: "Member role updated successfully" });
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(400).json({ 
      message: error.message || "Failed to update member" 
    });
  }
};

/**
 * Remove member from household (soft delete)
 */
export const removeMemberController = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await removeHouseholdMember(id);

    if (!removed) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({ message: "Member removed from household" });
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Delete member permanently
 */
export const deleteMemberController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteHouseholdMember(id);

    if (!deleted) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({ message: "Member deleted permanently" });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get member by ID
 */
export const getMemberByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await getHouseholdMemberById(id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(member);
  } catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Transfer member to different household
 */
export const transferMemberController = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_household_id } = req.body;

    if (!new_household_id) {
      return res.status(400).json({ message: "New household ID is required" });
    }

    await transferHouseholdMember(id, new_household_id);

    res.status(200).json({ message: "Member transferred successfully" });
  } catch (error) {
    console.error("Error transferring member:", error);
    res.status(400).json({ 
      message: error.message || "Failed to transfer member" 
    });
  }
};