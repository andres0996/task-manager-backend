/**
 * Custom error classes for the application.
 *
 * Provides specific error types to handle different scenarios consistently.
 */
import {AppError} from "../middlewares/error.middleware";

/**
 * Error thrown when a request is invalid or malformed.
 *
 * Example: missing required fields, invalid email format, etc.
 */
export class BadRequestError extends AppError {
  /**
   * @param message - Optional custom error message
   */
  constructor(message?: string) {
    super(message || "Bad request", 400);
    this.name = "BadRequestError";
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
