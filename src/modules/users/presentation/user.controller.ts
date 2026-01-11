import { Request, Response } from 'express';
import { UserService } from '../application/user.service';
import { UserFirestoreRepository } from '../infrastructure/user.firestore.repository';
import { BadRequestError } from '../../../shared/errors/bad-request.error';

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
      const { email } = req.body;

      if (!email) {
        throw new BadRequestError('Email is required');
      }

      const user = await this.service.createUser(email);
      res.status(201).json({
        message: 'User created successfully',
        data: { email: user.email, createdAt: user.createdAt },
      });
    } catch (err: any) {
      res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
      });
    }
  }
}
