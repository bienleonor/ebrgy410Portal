import express from "express";
import { getAllPositionsController } from "../controllers/positionController.js";

const router = express.Router();

router.get("/", getAllPositionsController);

export default router;