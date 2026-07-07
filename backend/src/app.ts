import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import aiRoutes from './routes/ai.routes';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

export default app;
