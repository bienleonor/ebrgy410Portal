import censusModel from "../models/censusModel.js";
import { getBrgyOfficialByResidentId } from "../models/BrgyOfficialModel.js";
import { getVerifiedConstituentIdByUserId } from "../models/User.js";

// Submit census form
export const submitCensus = async (req, res) => {
  try {
    const censusData = req.body;
    const collectedBy = req.user?.user_id || null; // From auth middleware

    // Validate required fields
    const requiredFields = [
      'first_name', 'last_name', 'sex', 'birthdate',
      'birth_city_municipality', 'birth_province', 'birth_country',
      'nationality', 'house_number', 'street_id', 'brgy_id'
    ];

    for (const field of requiredFields) {
      if (!censusData[field]) {
        return res.status(400).json({
          message: `Missing required field: ${field}`
        });
      }
    }

    const result = await censusModel.submitCensus(censusData, collectedBy);

    res.status(201).json({
      message: "Census form submitted successfully",
      submission_id: result.submission_id,
      staging_id: result.staging_id
    });
  } catch (error) {
    console.error("Error submitting census:", error);
    res.status(500).json({ message: "Failed to submit census form" });
  }
};

// Get all staging census records
export const getAll = async (req, res) => {
  try {
    const records = await censusModel.getAll();
    res.json(records);
  } catch (error) {
    console.error("Error fetching census records:", error);
    res.status(500).json({ message: "Failed to fetch census records" });
  }
};

// Get by submission ID
export const getBySubmissionId = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const record = await censusModel.getBySubmissionId(submissionId);

    if (!record) {
      return res.status(404).json({ message: "Census record not found" });
    }

    res.json(record);
  } catch (error) {
    console.error("Error fetching census record:", error);
    res.status(500).json({ message: "Failed to fetch census record" });
  }
};

// Search census records
export const search = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: "Search term must be at least 2 characters" });
    }

    const results = await censusModel.search(q.trim());
    res.json(results);
  } catch (error) {
    console.error("Error searching census records:", error);
    res.status(500).json({ message: "Failed to search census records" });
  }
};

// Update status
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_id } = req.body;

    if (!status_id) {
      return res.status(400).json({ message: "status_id is required" });
    }

    const updated = await censusModel.updateStatus(id, status_id);

    if (!updated) {
      return res.status(404).json({ message: "Census record not found" });
    }

    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

// Validate census and move to verified_constituent
export const validateCensus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Get brgy_official_no from logged-in user
    let validatedBy = null;
    
    try {
      // Get verified_id directly from users table
      const verifiedId = await getVerifiedConstituentIdByUserId(userId);
      console.log("Verified ID:", verifiedId);
      
      if (verifiedId) {
        // Get brgy_official record using verified_id
        const official = await getBrgyOfficialByResidentId(verifiedId);
        console.log("Official info:", official);
        
        if (official) {
          validatedBy = official.brgy_official_no;
        }
      }
    } catch (err) {
      console.error("Error getting official info:", err);
    }

    if (!validatedBy) {
      return res.status(403).json({ message: "Only barangay officials can validate census records" });
    }

    const result = await censusModel.validateCensus(id, validatedBy);
    res.json({ 
      message: "Census record validated successfully",
      constituent_id: result.constituent_id 
    });
  } catch (error) {
    console.error("Error validating census:", error);
    res.status(500).json({ message: "Failed to validate census record" });
  }
};

// Reject census
export const rejectCensus = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejection_notes } = req.body;

    if (!rejection_notes) {
      return res.status(400).json({ message: "rejection_notes is required" });
    }

    const updated = await censusModel.rejectCensus(id, rejection_notes);

    if (!updated) {
      return res.status(404).json({ message: "Census record not found" });
    }

    res.json({ message: "Census record rejected successfully" });
  } catch (error) {
    console.error("Error rejecting census:", error);
    res.status(500).json({ message: "Failed to reject census record" });
  }
};
