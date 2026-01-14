/**
 * User Controller
 *
 * Handles HTTP requests related to User operations.
 * Acts as the interface between incoming HTTP requests and the UserService.
 *
 */

import {Request, Response} from "express";
import {UserService} from "../application/user.service";
import {UserFirestoreRepository} from "../infrastructure/user.firestore.repository";
import {BadRequestError} from "../../../shared/errors/bad-request.error";
import {AppError} from "../../../shared/middlewares/error.middleware";

export class UserController {
  private service: UserService;

  /**
   * Constructs the UserController.
   *
   * @param service - Optional UserService instance (for testing or dependency injection)
   */
  constructor(service?: UserService) {
    this.service = service ?? new UserService(new UserFirestoreRepository());
  }

  /**
   * Handles user creation.
   *
   * @param req - Express request object containing the email in req.body
   * @param res - Express response object to send the result
   */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const {email} = req.body || {};

      if (!email) {
        throw new BadRequestError("Email is required");
      }

      const user = await this.service.createUser(email);
      res.status(201).json({
        message: "User created successfully",
        data: {email: user.email, createdAt: user.createdAt},
      });
    } catch (err: any) {
      if (err instanceof AppError) {
        // Use statusCode from AppError subclasses
        res.status(err.statusCode).json({message: err.message});
      } else {
        // Any other unexpected error
        res.status(500).json({message: err.message || "Internal server error"});
      }
    }
  }

  /**
   * Handles finding an existing user by email.
   *
   * @param req - Express request object containing email in query parameters
   * @param res - Express response object to send the result
   */
  async findUser(req: Request, res: Response): Promise<void> {
    try {
      const {email} = req.query;

      if (!email || typeof email !== "string") {
        throw new BadRequestError("Email is required");
      }

      const user = await this.service.findUser(email);

      res.status(200).json({
        message: "User found successfully",
        data: {email: user.email, createdAt: user.createdAt},
      });
    } catch (err: any) {
      if (err instanceof AppError) {
        res.status(err.statusCode).json({message: err.message});
      } else {
        res.status(500).json({message: err.message || "Internal server error"});
      }
    }
  }
}
