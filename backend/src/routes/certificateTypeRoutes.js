import express from "express";
import { getAllCertificateTypes } from "../controllers/certificateTypeController.js";

const router = express.Router();

// Public route — no auth needed
router.get("/", getAllCertificateTypes);

export default router;
