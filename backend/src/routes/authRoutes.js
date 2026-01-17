import express from 'express';
import { signup, login, checkVerifiedConstituent, sendOTP, verifyOTP, createAccountFromVerified } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// New account creation flow for verified constituents
router.post('/check-constituent', checkVerifiedConstituent); // Step 1: Check if constituent exists
router.post('/send-otp', sendOTP);                           // Step 2: Send OTP to email
router.post('/verify-otp', verifyOTP);                       // Step 3: Verify OTP
router.post('/create-account', createAccountFromVerified);   // Step 4: Create account

export default router;
