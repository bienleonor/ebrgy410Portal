import verifiedConstituentModel from "../models/verifiedConstituentModel.js";
import { getVerifiedConstituentIdByUserId } from "../models/User.js";

const verifiedConstituentController = {
  // Get all verified constituents
  async getAll(req, res) {
    try {
      const constituents = await verifiedConstituentModel.getAll();
      res.json(constituents);
    } catch (error) {
      console.error("Error fetching verified constituents:", error);
      res.status(500).json({ message: "Failed to fetch verified constituents" });
    }
  },

  // Get authenticated user's verified constituent profile
  async getMyProfile(req, res) {
    try {
      const userId = req.user?.id || req.user?.user_id;
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Get verified_constituent_id from User model
      const verifiedConstituentId = await getVerifiedConstituentIdByUserId(userId);

      if (!verifiedConstituentId) {
        return res.status(404).json({ message: "No verified constituent profile found" });
      }

      // Use getById from model
      const constituent = await verifiedConstituentModel.getById(verifiedConstituentId);

      if (!constituent) {
        return res.status(404).json({ message: "Verified constituent not found" });
      }

      res.json(constituent);
    } catch (error) {
      console.error("Error fetching my profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  },

  // Get verified constituent by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const constituent = await verifiedConstituentModel.getById(id);

      if (!constituent) {
        return res.status(404).json({ message: "Verified constituent not found" });
      }

      res.json(constituent);
    } catch (error) {
      console.error("Error fetching verified constituent:", error);
      res.status(500).json({ message: "Failed to fetch verified constituent" });
    }
  },

  // Search verified constituents
  async search(req, res) {
    try {
      const { q } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({ message: "Search term must be at least 2 characters" });
      }

      const results = await verifiedConstituentModel.search(q.trim());
      res.json(results);
    } catch (error) {
      console.error("Error searching verified constituents:", error);
      res.status(500).json({ message: "Failed to search verified constituents" });
    }
  },

  // Update email only
  async updateEmail(req, res) {
    try {
      const { id } = req.params;
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const updated = await verifiedConstituentModel.updateEmail(id, email);

      if (!updated) {
        return res.status(404).json({ message: "Verified constituent not found" });
      }

      res.json({ message: "Email updated successfully" });
    } catch (error) {
      console.error("Error updating email:", error);
      res.status(500).json({ message: "Failed to update email" });
    }
  },

  // Update editable fields (not from staging_census)
  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Validate email if provided
      if (updateData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateData.email)) {
          return res.status(400).json({ message: "Invalid email format" });
        }
      }

      const updated = await verifiedConstituentModel.update(id, updateData);

      if (!updated) {
        return res.status(404).json({ message: "Verified constituent not found" });
      }

      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  },

  // Update authenticated user's profile (only editable fields)
  async updateMyProfile(req, res) {
    try {
      const userId = req.user?.id || req.user?.user_id;
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Get verified_constituent_id from User model
      const verifiedConstituentId = await getVerifiedConstituentIdByUserId(userId);

      if (!verifiedConstituentId) {
        return res.status(404).json({ message: "No verified constituent profile found" });
      }

      const updateData = req.body;

      // Validate email if provided
      if (updateData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateData.email)) {
          return res.status(400).json({ message: "Invalid email format" });
        }
      }

      // Validate civil_status is a number (stat_id), not a string
      if (updateData.civil_status !== undefined && updateData.civil_status !== null) {
        const civilStatusId = Number(updateData.civil_status);
        if (isNaN(civilStatusId)) {
          return res.status(400).json({ 
            message: "Invalid civil status. Must be a valid status ID number." 
          });
        }
        updateData.civil_status = civilStatusId;
      }

      // Validate other ID fields are numbers
      const idFields = ['blood_type_id', 'educ_attain_id', 'income_range_id'];
      for (const field of idFields) {
        if (updateData[field] !== undefined && updateData[field] !== null && updateData[field] !== '') {
          const fieldValue = Number(updateData[field]);
          if (isNaN(fieldValue)) {
            return res.status(400).json({ 
              message: `Invalid ${field}. Must be a valid ID number.` 
            });
          }
          updateData[field] = fieldValue;
        }
      }

      const updated = await verifiedConstituentModel.update(verifiedConstituentId, updateData);

      if (!updated) {
        return res.status(404).json({ message: "Verified constituent not found" });
      }

      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating my profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  },

  // Update record status (admin only)
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ["Active", "Inactive", "Deceased", "Migrated"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
      }

      const updated = await verifiedConstituentModel.updateStatus(id, status);

      if (!updated) {
        return res.status(404).json({ message: "Verified constituent not found" });
      }

      res.json({ message: "Status updated successfully" });
    } catch (error) {
      console.error("Error updating status:", error);
      res.status(500).json({ message: "Failed to update status" });
    }
  },

  // Get statistics
  async getStats(req, res) {
    try {
      const stats = await verifiedConstituentModel.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  },
};

export default verifiedConstituentController;
