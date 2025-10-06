// routes/residentRoutes.js
import { Router } from "express";
import { addResident } from "../controllers/residentController.js";

const router = Router();

router.post("/", addResident);

export default router;
