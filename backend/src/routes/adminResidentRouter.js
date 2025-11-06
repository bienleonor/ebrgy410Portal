import { Router } from "express";
import {
  getResidentById,
  listAllResidents,
  deleteResident,
} from "../controllers/residentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { authorizeAccess } from "../middleware/accessControl.js";

const router = Router();

// ✅ Allow both Admin roles and specific positions
router.use(
  authMiddleware,
  authorizeAccess({
    roles: ["Admin", "SuperAdmin"],
    positions: [
      "Chairman/Chairwoman",
      "Secretary",
      "Councilor/Kagawad",
      "Treasurer",
      "Staff",
    ],
  })
);

router.get("/residents", listAllResidents);
router.get("/residents/:id", getResidentById);
router.delete("/residents/:id", deleteResident);

export default router;
