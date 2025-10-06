import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { getProtectedData } from '../controllers/protectedController.js';

const protectedRoute = express.Router();

// Protected route
router.get('/', authMiddleware, getProtectedData);

export default protectedRoute;
