import { AppError } from '../middlewares/error.middleware';

/**
 * Error thrown when a request is invalid or malformed.
 * Example: missing required fields, invalid email format, etc.
 */
export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request') {
    super(message, 400);
  }
}