import express from "express";
import {
  getAllHouseholdsController,
  getHouseholdByIdController,
  createHouseholdController,
  updateHouseholdController,
  deleteHouseholdController,
  getHouseholdStatisticsController
} from "../controllers/householdController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { authorizeAccess } from "../middleware/accessControl.js";

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeAccess({
  roles: ["admin", "superadmin"],
  positions: ["chairman/chairwoman", "councilor/kagawad", "secretary", "staff"]
}));

router.get("/", getAllHouseholdsController);
router.get("/statistics", getHouseholdStatisticsController);
router.get("/:id", getHouseholdByIdController);
router.post("/", createHouseholdController);
router.put("/:id", updateHouseholdController);
router.delete("/:id", deleteHouseholdController);



export default router;