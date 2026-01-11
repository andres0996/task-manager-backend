import { Request, Response } from 'express';
import { UserService } from '../application/user.service';
import { UserFirestoreRepository } from '../infrastructure/user.firestore.repository';
import { BadRequestError } from '../../../shared/errors/bad-request.error';
import { AppError } from '../../../shared/middlewares/error.middleware';

/**
 * Controller for User endpoints.
 * Handles HTTP requests and responses for user operations.
 */
export class UserController {
  private service: UserService;

  /**
   * Constructs the UserController.
   * @param service - The UserService instance
   */
  constructor(service?: UserService) {
    // If no service is provided, use the real Firestore implementation
    this.service = service ?? new UserService(new UserFirestoreRepository());
  }

  /**
   * Handles user creation.
   * POST /users
   */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body || {};

      if (!email) {
        throw new BadRequestError('Email is required');
      }

      const user = await this.service.createUser(email);
      res.status(201).json({
        message: 'User created successfully',
        data: { email: user.email, createdAt: user.createdAt },
      });
    } catch (err: any) {
      if (err instanceof AppError) {
        // Use statusCode from AppError subclasses
        res.status(err.statusCode).json({ message: err.message });
      } else {
        // Any other unexpected error
        res.status(500).json({ message: err.message || 'Internal server error' });
      }
    }
  }

  /**
   * Handles finding an existing user by email.
   * GET /users?email=<email>
   */
  async findUser(req: Request, res: Response): Promise<void> {
    try {
      // Get email from query parameters
      const { email } = req.query;

      if (!email || typeof email !== 'string') {
        throw new BadRequestError('Email is required');
      }

      const user = await this.service.findUser(email);

      res.status(200).json({
        message: 'User found successfully',
        data: { email: user.email, createdAt: user.createdAt },
      });
    } catch (err: any) {
      if (err instanceof AppError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message || 'Internal server error' });
      }
    }
  }
}
