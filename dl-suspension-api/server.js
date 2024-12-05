import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth.js';
import verifyToken from './middlewares/authMiddleware.js';

const app = express();
const port = 3001;

app.use(express.json());

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes
// app.use('/api/auth',verifyToken, authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});