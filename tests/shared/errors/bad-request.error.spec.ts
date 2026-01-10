import { BadRequestError } from '../../../src/shared/errors/bad-request.error';

/**
 * Unit tests for the `BadRequestError` class.
 * Ensures correct error name, message, and default behavior.
 */
describe('BadRequestError', () => {

  // Should create an instance with default message
  it('should create an instance with default message', () => {
    const error = new BadRequestError();
    expect(error).toBeInstanceOf(BadRequestError);
    expect(error.name).toBe('BadRequestError');
    expect(error.message).toBe('Bad request');
  });

  // Should create an instance with custom message
  it('should create an instance with custom message', () => {
    const error = new BadRequestError('Invalid email format');
    expect(error.message).toBe('Invalid email format');
  });

  // Should maintain proper prototype chain
  it('should have proper prototype chain', () => {
    const error = new BadRequestError();
    expect(error instanceof Error).toBe(true);
  });

});