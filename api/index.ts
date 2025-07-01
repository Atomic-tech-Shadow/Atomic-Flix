// Vercel serverless function to handle API routes
import express from 'express';
import { registerRoutes } from '../server/routes';

const app = express();

// Configure Express for Vercel
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register all routes
registerRoutes(app);

export default app;