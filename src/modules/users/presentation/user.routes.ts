import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();
const controller = new UserController();

/**
 * User routes
 */
router.post('/', (req, res) => controller.createUser(req, res));

export default router;