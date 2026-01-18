import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { authorizeAccess } from "../middleware/accessControl.js";
import {
  createCertificateRequest,
  updateCertificateStatus,
  getMyCertificateRequests,
  getAllCertificateRequests,
  releaseCertificate
} from "../controllers/certificateRequestController.js";

const router = express.Router();

// Resident routes
router.post(
  "/request",
  authMiddleware,
  authorizeAccess({ roles: ["Resident"] }),
  createCertificateRequest
);

router.get(
  "/my-requests",
  authMiddleware,
  authorizeAccess({ roles: ["Resident"] }),
  getMyCertificateRequests
);

// Admin & Officials
router.get(
  "/requests",
  authMiddleware,
  authorizeAccess({
    roles: ["Admin", "SuperAdmin"],
    positions: [
      "Chairman/Chairwoman",
      "Secretary",
      "Treasurer",
      "Councilor/Kagawad",
      "Staff",
    ],
  }),
  getAllCertificateRequests
);

router.put(
  "/:cert_req_id/status",
  authMiddleware,
  authorizeAccess({
    roles: ["Admin", "SuperAdmin"],
    positions: [
      "Chairman/Chairwoman",
      "Secretary",
      "Treasurer",
      "Councilor/Kagawad",
      "Staff",
    ],
  }),
  updateCertificateStatus
);

router.put(
  "/:cert_req_id/release",
  authMiddleware,
  authorizeAccess({
    roles: ["Admin", "SuperAdmin"],
    positions: [
      "Chairman/Chairwoman",
      "Secretary",
      "Treasurer",
      "Councilor/Kagawad",
      "Staff",
    ],
  }),
  releaseCertificate
);

export default router;
