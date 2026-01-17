// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { EventEmitter } from 'events';
import path from "path";
import pool from './config/pool.js';
import rateLimiter from './middleware/rateLimiter.js';
import { startLibreOfficeDaemon, stopLibreOfficeDaemon } from './utils/generateCertificateFromDocx.js';

// Routes
import authRoutes from './routes/authRoutes.js';

// import brgyOfficialRoutes from './routes/brgyOfficialRouter.js';
import residentRoutes from './routes/residentRoutes.js'
import addressRoutes from "./routes/addressRoutes.js";
import adminResidentRoutes from "./routes/adminResidentRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import certificateTypeRoutes from "./routes/certificateTypeRoutes.js";
import certificateAttachmentRoutes from "./routes/certificateAttachmentRoutes.js";
import positionRoutes from "./routes/positionRoutes.js";
import statusRoutes from "./routes/statusRoutes.js";
import brgyOfficialRoutes from "./routes/brgyOfficialRoutes.js";
import householdRoutes from "./routes/householdRoutes.js";
import householdMemberRoutes from "./routes/householdMemberRoutes.js";
import dashboardRoutes from "./routes/adminDashboardRoutes.js";
import verifiedConstituentRoutes from "./routes/verifiedConstituentRoutes.js";
import lookupRoutes from "./routes/lookupRoutes.js";
import censusRoutes from "./routes/censusRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";

//Middleware
import authMiddleware from './middleware/authMiddleware.js';

EventEmitter.defaultMaxListeners = 20;
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
  origin: 'http://localhost:5173',  // Your React dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(rateLimiter);

// --- Test Route ---
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Barangay 410 API' });
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/brgy-officials', brgyOfficialRoutes);
app.use('/api/residents', residentRoutes);
app.use("/api/address", addressRoutes);
app.use('/api/admin', adminResidentRoutes);
app.use("/api/certificates/types", certificateTypeRoutes);
app.use("/api/certificate-attachments", certificateAttachmentRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/households", householdRoutes);
app.use("/api/household-members", householdMemberRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/verified-resident", verifiedConstituentRoutes);
app.use("/api/lookup", lookupRoutes);
app.use("/api/census", censusRoutes);
app.use("/api/otp", otpRoutes);

// Securely serve files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); // ✅ works now

app.use("/api/certificates", certificateRoutes);


// --- Start Server ---
app.listen(PORT, async () => {
  try {
    await pool.getConnection(); // Check DB connection
    console.log('✅ Connected to MySQL DB');
    
    // Start LibreOffice daemon for PDF conversions
    await startLibreOfficeDaemon();
    
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error('❌ Server startup failed:', err);
    process.exit(1);
  }
});

// --- Graceful Shutdown ---
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  stopLibreOfficeDaemon();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  stopLibreOfficeDaemon();
  process.exit(0);
});
