import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import aiRoutes from './routes/ai.routes';
import complaintsRoutes from './routes/complaints.routes';
import { googleAuthHandler } from './controllers/google-auth.controller';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/complaints', complaintsRoutes);

// Google OAuth registration endpoint
app.post('/api/auth/google', googleAuthHandler);

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', version: '2.0', timestamp: new Date() });
});

export default app;
