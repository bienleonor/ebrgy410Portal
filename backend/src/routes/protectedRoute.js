import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getProtectedData } from "../controllers/protectedController.js";

const protectedRoute = express.Router();

// Protected route
router.get('/', authMiddleware, getProtectedData);

export default protectedRoute;
