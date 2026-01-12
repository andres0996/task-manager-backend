/**
 * Main Express application setup.
 * 
 * Configures middleware and routes for the backend API.
 * This file defines all the endpoints and exports the configured Express app.
 */

import express from 'express';
import userRoutes from './modules/users/presentation/user.routes';
import taskRoutes from './modules/tasks/presentation/task.routes';
import authRoutes from './modules/auth/presentation/auth.routes';

const app = express();

/**
 * Middleware to parse incoming JSON requests.
 * All request bodies will be available under req.body.
 */
app.use(express.json());

/**
 * Route definitions
 * Each module is mounted under its corresponding API path.
 */
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/auth', authRoutes);

/**
 * Health check endpoint
 * Can be used to verify that the API is running.
 */
app.get('/', (_req, res) => {
  res.send('API is running');
});

/**
 * Export the configured Express application
 * This is imported in the entry point (index.ts) to start the server.
 */
export default app;