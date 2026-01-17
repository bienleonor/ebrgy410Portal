import express from "express";
import verifiedConstituentController from "../controllers/verifiedConstituentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all verified constituents
router.get("/", verifiedConstituentController.getAll);

// Get statistics
router.get("/stats", verifiedConstituentController.getStats);

// Search verified constituents
router.get("/search", verifiedConstituentController.search);

// Get verified constituent by ID
router.get("/:id", verifiedConstituentController.getById);

// Update editable fields (user can update certain fields)
router.patch("/:id", verifiedConstituentController.update);

// Update email only (user can update their own email)
router.patch("/:id/email", verifiedConstituentController.updateEmail);

// Update record status (admin only)
router.patch("/:id/status", verifiedConstituentController.updateStatus);

export default router;
