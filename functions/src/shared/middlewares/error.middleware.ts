/**
 * Global error handling setup.
 *
 * Provides a custom AppError class and an Express middleware
 * to catch errors from controllers or services and respond with JSON.
 */
import {Request, Response, NextFunction} from "express";

/**
 * Base class for application-specific errors.
 * Provides consistent handling of HTTP status codes and messages.
 */
export class AppError extends Error {
  statusCode: number;

  /**
   * @param message - Message of the error
   * @param statusCode - HTTP status code (default: 500)
   */
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
  }
}

/**
 * Express middleware to catch errors and return a JSON response.
 *
 * @param err - The error object
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next middleware function
 */
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {

  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({message});
};
