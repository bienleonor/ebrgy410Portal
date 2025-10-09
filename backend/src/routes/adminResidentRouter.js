import { Router } from "express";
import {
  getResidentById,
  listAllResidents,
  deleteResident,
} from "../controllers/residentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = Router();

// Only allow admins and superadmins
router.use(authMiddleware, allowRoles(["chairman/chairwoman", "superadmin", "councilor/kagawad", "secretary"]));

router.get("/residents", listAllResidents);
router.get("/residents/:id", getResidentById);
router.delete("/residents/:id", deleteResident);

export default router;
