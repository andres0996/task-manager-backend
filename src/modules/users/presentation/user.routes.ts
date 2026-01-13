/**
 * User Routes
 *
 * Defines the HTTP endpoints for User-related operations.
 *
 */

import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();
const controller = new UserController();

/**
 * Create a new user
 * POST /users
 *
 * Request body:
 * {
 *   "email": "user@example.com"
 * }
 *
 * Response:
 * 201 Created
 * {
 *   "message": "User created successfully",
 *   "data": { "email": "user@example.com", "createdAt": "2026-01-12T12:34:56.789Z" }
 * }
 */
router.post('/', (req, res) => controller.createUser(req, res));

/**
 * Find an existing user by email
 * GET /users/email?email=<email>
 *
 * Query params:
 * - email: string
 *
 * Response:
 * 200 OK
 * {
 *   "message": "User found successfully",
 *   "data": { "email": "user@example.com", "createdAt": "2026-01-12T12:34:56.789Z" }
 * }
 */
router.get('/email', (req, res) => controller.findUser(req, res));

export default router;