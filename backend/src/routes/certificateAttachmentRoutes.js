import express from "express";
import { 
  downloadCertificate, 
  getCertificateInfo,
  getResidentCertificates 
} from "../controllers/certificateAttachmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 📥 Download/Print certificate PDF
router.get("/download/:request_id", authMiddleware, downloadCertificate);

// 📄 Get certificate info (metadata only)
router.get("/info/:request_id", authMiddleware, getCertificateInfo);

// 📋 Get all certificates for a resident
router.get("/resident/:resident_id", authMiddleware, getResidentCertificates);

export default router;