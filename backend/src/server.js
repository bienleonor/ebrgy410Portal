// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { EventEmitter } from 'events';

import pool from './config/pool.js';
import rateLimiter from './middleware/rateLimiter.js';

// Routes
import authRoutes from './routes/authRouter.js';
import brgyOfficialRoutes from './routes/brgyOfficialRouter.js';
import residentRoutes from './routes/residentRouter.js'

//Middleware
import authMiddleware from './middleware/AuthMiddleware.js';

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
app.use('/api/protected/brgyOfficials', authMiddleware, brgyOfficialRoutes);
app.use('/api/resident', residentRoutes);


// --- Start Server ---
app.listen(PORT, async () => {
  try {
    await pool.getConnection(); // Check DB connection
    console.log('✅ Connected to MySQL DB');
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error('❌ DB Connection failed:', err);
    process.exit(1);
  }
});
