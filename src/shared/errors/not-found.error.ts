import { AppError } from '../middlewares/error.middleware';

/**
 * Error thrown when a resource is not found.
 * Example: trying to get a task or user that does not exist in Firestore.
 */
export class NotFoundError extends AppError {
  constructor(message?: string) {
    super(message || 'Resource not found', 404); // set statusCode 404
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype); // fix instanceof
  }
}