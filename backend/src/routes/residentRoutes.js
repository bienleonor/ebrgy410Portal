import { Router } from "express";
import {
  addResident,
  getMyResidentProfile,
  updateMyResidentProfile,
} from "../controllers/residentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { authorizeAccess } from "../middleware/accessControl.js";

const router = Router();

// ✅ Only Residents can use these endpoints
router.use(authMiddleware, authorizeAccess({ roles: ["Resident"] }));

router.get("/profile/me", getMyResidentProfile);
router.post("/profile", addResident);
router.put("/profile", updateMyResidentProfile);

export default router;
