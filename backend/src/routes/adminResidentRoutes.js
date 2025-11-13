import { Router } from "express";
import {
  getResidentById,
  listAllResidents,
  deleteResident,
  createResidentWithAccount,
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

//Admin Resident List
router.get("/residents", listAllResidents);
router.get("/residents/:id", getResidentById);
router.delete("/residents/:id", deleteResident);


// Admin Create Resident Account... 
router.post("/register-with-account", createResidentWithAccount);
router.put("/register-with-account", createResidentWithAccount);


export default router;
