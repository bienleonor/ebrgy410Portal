import express from "express";
import lookupController from "../controllers/lookupController.js";

const router = express.Router();

// All lookup routes are public (no auth required for dropdowns)
router.get("/blood-types", lookupController.getBloodTypes);
router.get("/education-attainments", lookupController.getEducationAttainments);
router.get("/income-ranges", lookupController.getIncomeRanges);
router.get("/civil-status-options", lookupController.getCivilStatusOptions);
router.get("/record-status-options", lookupController.getRecordStatusOptions);
router.get("/certificate-status", lookupController.getCertificateStatuses);

export default router;
