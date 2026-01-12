import express from 'express';
import userRoutes from './modules/users/presentation/user.routes';
import taskRoutes from './modules/tasks/presentation/task.routes';
import authRoutes from './modules/auth/presentation/auth.routes';

const app = express();

// Global middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/auth', authRoutes);

// Service availability check
app.get('/', (_req, res) => {
  res.send('API is running');
});

export default app;
