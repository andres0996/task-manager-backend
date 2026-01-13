/**
 * Auth routes module
 *
 * Defines all authentication-related routes.
 * Exports a router that can be mounted in the main app.
 */

import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from '../application/auth.service';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware';

const router = Router();

const authService = new AuthService();
const authController = new AuthController(authService);

/**
 * Login with email, generate JWT token
 *
 * @route POST /api/v1/auth/login
 * @access Public
 */
router.post('/login', (req, res) => authController.login(req, res));

export default router;
