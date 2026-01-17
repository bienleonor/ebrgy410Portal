import express from "express";
import * as censusController from "../controllers/censusController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route - submit census (no auth required)
router.post("/submit", censusController.submitCensus);

// Protected routes - require authentication
router.use(authMiddleware);

// Get all staging census records
router.get("/", censusController.getAll);

// Search census records
router.get("/search", censusController.search);

// Get by submission ID
router.get("/:submissionId", censusController.getBySubmissionId);

// Update status
router.patch("/:id/status", censusController.updateStatus);

// Validate census (move to verified_constituent)
router.post("/:id/validate", censusController.validateCensus);

// Reject census
router.post("/:id/reject", censusController.rejectCensus);

export default router;
