/**
 * Custom error classes for the application.
 * 
 * Provides specific error types to handle different scenarios consistently.
 */
import { AppError } from '../middlewares/error.middleware';

/**
 * Error thrown when a resource is not found.
 * 
 * Example: trying to get a task or user that does not exist in Firestore.
 */
export class NotFoundError extends AppError {
  /**
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || 'Resource not found', 404);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
