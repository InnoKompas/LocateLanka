

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import gnDivisionRoutes from './routes/gnDivision';
import authRoutes from './routes/auth.routes';
import { apiKeyMiddleware } from './middlewares/apiKey';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env['CLIENT_URL'] || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (_req, res) => {
	res.status(200).json({ status: 'ok' });
});

// Auth routes (no API key required)
app.use('/auth', authRoutes);

// Routes that require API key
app.use(apiKeyMiddleware);

// GN Division API routes
app.use('/', gnDivisionRoutes);

export default app;
