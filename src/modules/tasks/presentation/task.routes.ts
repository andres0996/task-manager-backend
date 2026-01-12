import { Router } from 'express';
import { TaskController } from './task.controller';

const router = Router();
const controller = new TaskController();

/**
 * Task routes
 */

// POST /tasks → create a new task
router.post('/', (req, res) => controller.createTask(req, res));

export default router;