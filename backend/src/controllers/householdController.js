// src/controllers/householdController.js
import {
  getAllHouseholds,
  getHouseholdById,
  createHousehold,
  updateHousehold,
  deleteHousehold,
  getHouseholdStatistics
} from "../models/householdModel.js";
import { getBrgyOfficialByResidentId } from "../models/BrgyOfficialModel.js";
import { getResidentByUserId } from "../models/residentModel.js";

/**
 * Get all households
 */
export const getAllHouseholdsController = async (req, res) => {
  try {
    const households = await getAllHouseholds();
    res.status(200).json(households);
  } catch (error) {
    console.error("Error fetching households:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get household by ID
 */
export const getHouseholdByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const household = await getHouseholdById(id);

    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }

    res.status(200).json(household);
  } catch (error) {
    console.error("Error fetching household:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Create new household
 */
export const createHouseholdController = async (req, res) => {
  try {
    const { address_id } = req.body;

    if (!address_id) {
      return res.status(400).json({ message: "Address ID is required" });
    }

    // Try to get brgy_official_no from logged-in user
    let createdBy = null;
    
    if (req.user?.id) {
      try {
        const resident = await getResidentByUserId(req.user.id);
        
        if (resident) {
          const official = await getBrgyOfficialByResidentId(resident.resident_id);
          
          if (official && official.stat_id === 1) { // Only active officials
            createdBy = official.brgy_official_no;
          }
        }
      } catch (err) {
        // User is not an official, createdBy stays null
        console.log("User is not a barangay official");
      }
    }

    const householdId = await createHousehold(address_id, createdBy);

    res.status(201).json({
      message: "Household created successfully",
      household_id: householdId
    });
  } catch (error) {
    console.error("Error creating household:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};
/**
 * Update household
 */
export const updateHouseholdController = async (req, res) => {
  try {
    const { id } = req.params;
    const { address_id } = req.body;

    if (!address_id) {
      return res.status(400).json({ message: "Address ID is required" });
    }

    const updated = await updateHousehold(id, address_id);

    if (!updated) {
      return res.status(404).json({ message: "Household not found" });
    }

    res.status(200).json({ message: "Household updated successfully" });
  } catch (error) {
    console.error("Error updating household:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Delete household
 */
export const deleteHouseholdController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteHousehold(id);

    if (!deleted) {
      return res.status(404).json({ message: "Household not found" });
    }

    res.status(200).json({ message: "Household deleted successfully" });
  } catch (error) {
    console.error("Error deleting household:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get household statistics
 */
export const getHouseholdStatisticsController = async (req, res) => {
  try {
    const stats = await getHouseholdStatistics();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};