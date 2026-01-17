import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verifiedConstituentController from "../controllers/verifiedConstituentController.js";
import { authorizeAccess } from "../middleware/accessControl.js";

const router = Router();

// ✅ Only Residents can use these endpoints
router.use(authMiddleware, authorizeAccess({ roles: ["Resident"] }));

router.get("/profile/me", verifiedConstituentController.getMyProfile);
router.put("/profile", verifiedConstituentController.updateMyProfile);

export default router;
