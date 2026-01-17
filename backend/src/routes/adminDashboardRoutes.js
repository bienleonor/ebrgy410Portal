import express from "express";
import { getDashboardStats, getStatistics } from "../controllers/adminDashboardController.js";
import authMiddleware  from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", authMiddleware, getDashboardStats);
router.get("/statistics", authMiddleware, getStatistics);

export default router;
