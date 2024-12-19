import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth.js';
import schedulerRoutes from './routes/scheduler.js';
import challanRoutes from './routes/challan.js';
import verifyToken from './middlewares/authMiddleware.js';
import rtoAdmin from './routes/rtoAdmin.js';
import sarthiRoutes from './routes/sarthi.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { swaggerUi, specs } from './utils/swagger.js';
import morgan from 'morgan';
const app = express();
const port = process.env.API_PORT || 3001;

app.use(express.json());
// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Public Routes
app.use('/api/auth', authRoutes);
app.use('/api/scheduler', schedulerRoutes);
app.use('/api/challan', challanRoutes);
app.use('/api/sarthi', sarthiRoutes);

// Protected Route
app.use('/api/',verifyToken, rtoAdmin);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});