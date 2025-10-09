import { Router } from "express";
import {
  addResident,
  getMyResidentProfile,
  updateMyResidentProfile,
} from "../controllers/residentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = Router();

router.use(authMiddleware, allowRoles(["resident"]));

router.get("/profile/me", getMyResidentProfile);
router.post("/profile", addResident);
router.put("/profile", updateMyResidentProfile);

export default router;
