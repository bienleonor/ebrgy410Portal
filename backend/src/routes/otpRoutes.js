import express from "express";
import { sendOtp, verifyOtpController } from "../controllers/otpController.js";
import { createAccount } from "../controllers/newAccountCreation.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpController);
router.post("/create-account", createAccount);

export default router;
