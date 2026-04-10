import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

export const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Backend funcionando' });
});

app.use('/api/auth', authRoutes);
app.use('/api/gastos', expenseRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
