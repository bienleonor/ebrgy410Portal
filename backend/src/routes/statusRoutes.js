import express from "express";
import { getAllStatusesController } from "../controllers/statusController.js";

const router = express.Router();

router.get("/", getAllStatusesController);

export default router;