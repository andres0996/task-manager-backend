import { NotFoundError } from '../../../src/shared/errors/not-found.error';

/**
 * Unit tests for the `NotFoundError` class.
 * 
 * Ensures correct error name, message, and prototype behavior.
 */
describe('NotFoundError', () => {

  /**
   * Test case: default message
   * Expected behavior: creates an instance with default message "Resource not found"
   */
  it('should create an instance with default message', () => {
    const error = new NotFoundError();
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.name).toBe('NotFoundError');
    expect(error.message).toBe('Resource not found');
  });

  /**
   * Test case: custom message
   * Expected behavior: creates an instance with the provided custom message
   */
  it('should create an instance with custom message', () => {
    const error = new NotFoundError('User not found');
    expect(error.message).toBe('User not found');
  });

  /**
   * Test case: prototype chain
   * Expected behavior: instance should be recognized as both NotFoundError and Error
   */
  it('should have proper prototype chain', () => {
    const error = new NotFoundError();
    expect(error instanceof Error).toBe(true);
  });

});