import { errorMiddleware } from '../../../src/shared/middlewares/error.middleware';
import { BadRequestError } from '../../../src/shared/errors/bad-request.error';
import { NotFoundError } from '../../../src/shared/errors/not-found.error';
import { Request, Response, NextFunction } from 'express';

/**
 * Unit tests for the `errorMiddleware` function.
 * Ensures correct HTTP status codes and JSON responses
 * for different error types in Express.
 */
describe('errorMiddleware', () => {

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  // Mock Express request, response, and next function before each test
  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(), // allows chaining res.status(...).json(...)
      json: jest.fn(), // captures the JSON response sent by the middleware
    };
    next = jest.fn();
  });

  // Generic errors should return HTTP 500 with error message
  it('should return HTTP 500 with the error message for generic errors', () => {
    const error = new Error('Something went wrong');

    errorMiddleware(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Something went wrong',
    });
  });

  // BadRequestError should return HTTP 400 with its message
  it('should return HTTP 400 with the correct message for BadRequestError', () => {
    const error = new BadRequestError('Invalid input');

    errorMiddleware(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid input',
    });
  });

  // NotFoundError should return HTTP 404 with its message
  it('should return HTTP 404 with the correct message for NotFoundError', () => {
    const error = new NotFoundError('Resource not found');

    errorMiddleware(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Resource not found',
    });
  });

});
