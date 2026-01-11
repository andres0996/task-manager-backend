import express from 'express';
import userRoutes from './modules/users/presentation/user.routes';

const app = express();

// Global middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/v1/users', userRoutes);

// Service availability check
app.get('/', (_req, res) => {
  res.send('API is running');
});

export default app;
