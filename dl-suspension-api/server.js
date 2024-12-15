import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth.js';
import schedulerRoutes from './routes/scheduler.js';
import challanRoutes from './routes/challan.js';
import verifyToken from './middlewares/authMiddleware.js';
import rtoAdmin from './routes/rtoAdmin.js';
import cors from 'cors';
import morgan from 'morgan';
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Public Routes
app.use('/api/auth', authRoutes);
app.use('/api/scheduler', schedulerRoutes);
app.use('/api/challan', challanRoutes);

// Protected Route
app.use('/api/',verifyToken, rtoAdmin);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});