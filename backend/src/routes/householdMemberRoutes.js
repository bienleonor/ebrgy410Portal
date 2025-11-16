import express from "express";
import {
  addMemberController,
  updateMemberController,
  removeMemberController,
  deleteMemberController,
  getMemberByIdController,
  transferMemberController
} from "../controllers/householdMemberController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { authorizeAccess } from "../middleware/accessControl.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);
router.use(authorizeAccess({
  roles: ["admin", "superadmin"],
  positions: ["chairman/chairwoman", "councilor/kagawad", "secretary", "staff"]
}));

// ===== HOUSEHOLD MEMBER ROUTES =====
router.post("/", addMemberController);
router.get("/:id", getMemberByIdController);
router.put("/:id", updateMemberController);
router.delete("/:id", removeMemberController); // Soft delete
router.post("/:id/transfer", transferMemberController);

export default router;