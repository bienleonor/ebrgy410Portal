import express from "express";
import { getAllBrgyOficialStatus, getAllDocumentStatus, getAllCivilStatus, getAllCensusStatus,
    createStatus, updateStatus, deleteStatus, statusById
}  from "../controllers/statusController.js";

const router = express.Router();

router.get("/brgyofficial", getAllBrgyOficialStatus);
router.get("/document", getAllDocumentStatus);
router.get("/civil", getAllCivilStatus);
router.get("/census", getAllCensusStatus);
router.get("/:id", statusById);
router.post("/", createStatus);
router.put("/:id", updateStatus);
router.delete("/:id", deleteStatus);


export default router;
