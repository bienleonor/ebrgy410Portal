import lookupModel from "../models/lookupModel.js";

const lookupController = {
  // Get blood types
  async getBloodTypes(req, res) {
    try {
      const bloodTypes = await lookupModel.getBloodTypes();
      res.json(bloodTypes);
    } catch (error) {
      console.error("Error fetching blood types:", error);
      res.status(500).json({ message: "Failed to fetch blood types" });
    }
  },

  // Get education attainments
  async getEducationAttainments(req, res) {
    try {
      const attainments = await lookupModel.getEducationAttainments();
      res.json(attainments);
    } catch (error) {
      console.error("Error fetching education attainments:", error);
      res.status(500).json({ message: "Failed to fetch education attainments" });
    }
  },

  // Get income ranges
  async getIncomeRanges(req, res) {
    try {
      const ranges = await lookupModel.getIncomeRanges();
      res.json(ranges);
    } catch (error) {
      console.error("Error fetching income ranges:", error);
      res.status(500).json({ message: "Failed to fetch income ranges" });
    }
  },

  // Get civil status options
  async getCivilStatusOptions(req, res) {
    try {
      const options = await lookupModel.getCivilStatusOptions();
      res.json(options);
    } catch (error) {
      console.error("Error fetching civil status options:", error);
      res.status(500).json({ message: "Failed to fetch civil status options" });
    }
  },

  // Get record status options
  async getRecordStatusOptions(req, res) {
    try {
      const options = await lookupModel.getRecordStatusOptions();
      res.json(options);
    } catch (error) {
      console.error("Error fetching record status options:", error);
      res.status(500).json({ message: "Failed to fetch record status options" });
    }
  },
  // Get record status options
  async getCertificateStatuses(req, res) {
    try {
      const options = await lookupModel.getCertificateStatus();
      res.json(options);
    } catch (error) {
      console.error("Error fetching record status options:", error);
      res.status(500).json({ message: "Failed to fetch record status options" });
    }
  },
};

export default lookupController;
