import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();
const controller = new AuthController();

/**
 * Auth routes
 */

// POST /auth/login → login with email and generate token
router.post('/login', (req, res) => controller.login(req, res));

export default router;