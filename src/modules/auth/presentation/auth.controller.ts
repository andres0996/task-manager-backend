/**
 * AuthController
 *
 * Handles authentication-related HTTP requests.
 * Provides endpoints for login and integrates with AuthService.
 */

import { Request, Response } from 'express';
import { AuthService } from '../application/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor(authService?: AuthService) {
    this.authService = authService ?? new AuthService();
  }

  /**
   * Handles user login requests.
   *
   * Validates the request body for a userEmail, calls AuthService.login to
   * authenticate the user, and returns a JWT token.
   *
   * @param req - Express Request object, expects { userEmail: string } in body
   * @param res - Express Response object
   * @returns void
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { userEmail } = req.body;

      if (!userEmail) {
        res.status(400).json({ message: 'userEmail is required' });
        return;
      }

      const token = await this.authService.login(userEmail);

      res.status(200).json({ token });
    } catch (err: any) {
      res.status(err.statusCode || 500).json({ message: err.message || 'Internal server error' });
    }
  }
}
