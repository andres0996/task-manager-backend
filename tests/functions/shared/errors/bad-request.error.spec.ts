import { BadRequestError } from '../../../../functions/src/shared/errors/bad-request.error';

/**
 * Unit tests for the `BadRequestError` class.
 * 
 * Ensures correct error name, message, and prototype behavior.
 */
describe('BadRequestError', () => {

  /**
   * Test case: default message
   * Expected behavior: creates an instance with default message "Bad request"
   */
  it('should create an instance with default message', () => {
    const error = new BadRequestError();
    expect(error).toBeInstanceOf(BadRequestError);
    expect(error.name).toBe('BadRequestError');
    expect(error.message).toBe('Bad request');
  });

  /**
   * Test case: custom message
   * Expected behavior: creates an instance with the provided custom message
   */
  it('should create an instance with custom message', () => {
    const error = new BadRequestError('Invalid email format');
    expect(error.message).toBe('Invalid email format');
  });

  /**
   * Test case: prototype chain
   * Expected behavior: instance should be recognized as both BadRequestError and Error
   */
  it('should have proper prototype chain', () => {
    const error = new BadRequestError();
    expect(error instanceof Error).toBe(true);
  });

});