import { Request, Response, NextFunction } from 'express';

/**
 * Base class for application-specific errors.
 * Enables consistent handling of status codes and error messages across the app.
 */
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;

    // Fix the prototype chain for proper instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);

    // Set the error name to the class name
    this.name = this.constructor.name;
  }
}

/**
 * Global error handling middleware for Express.
 * Catches errors thrown in controllers or services and sends a JSON response.
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
  next: NextFunction
) => {

  // Log the error only in development environment
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  // Use the error's statusCode if available, otherwise default to 500 (Internal Server Error)
  const status = err.statusCode || 500;

  // Use the error's message if available, otherwise a generic message
  const message = err.message || 'Internal Server Error';

  res.status(status).json({ message });
};
