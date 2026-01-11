import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();
const controller = new UserController();

/**
 * User routes
 */

// POST /users → create a new user
router.post('/', (req, res) => controller.createUser(req, res));

// GET /users/email?email=example@example.com → find existing user
router.get('/email', (req, res) => controller.findUser(req, res));

export default router;