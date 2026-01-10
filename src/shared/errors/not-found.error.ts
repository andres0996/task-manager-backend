import { AppError } from '../middlewares/error.middleware';

/**
 * Error thrown when a resource is not found.
 * Example: trying to get a task or user that does not exist in Firestore.
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}