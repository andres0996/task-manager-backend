import { NotFoundError } from '../../../src/shared/errors/not-found.error';

/**
 * Unit tests for the `NotFoundError` class.
 * Ensures correct error name, message, and default behavior.
 */
describe('NotFoundError', () => {

  // Should create an instance with default message
  it('should create an instance with default message', () => {
    const error = new NotFoundError();
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.name).toBe('NotFoundError');
    expect(error.message).toBe('Resource not found');
  });

  // Should create an instance with custom message
  it('should create an instance with custom message', () => {
    const error = new NotFoundError('User not found');
    expect(error.message).toBe('User not found');
  });

  // Should maintain proper prototype chain
  it('should have proper prototype chain', () => {
    const error = new NotFoundError();
    expect(error instanceof Error).toBe(true);
  });

});