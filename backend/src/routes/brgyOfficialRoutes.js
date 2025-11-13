import express from 'express';
import {
  getAllBrgyOfficialsController,
  getBrgyOfficialByID,
  createBrgyOfficialController,
  updateBrgyOfficials,
  deleteBrgyOfficials
} from '../controllers/brgyOfficialsController.js';

const router = express.Router();

// Protected routes for CRUD
router.get('/', getAllBrgyOfficialsController);
router.get('/:id', getBrgyOfficialByID);
router.post('/', createBrgyOfficialController);
router.put('/:id', updateBrgyOfficials);
router.delete('/:id', deleteBrgyOfficials);

export default router;
