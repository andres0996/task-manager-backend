import { isValidEmail } from '../../../../functions/src/shared/utils/validate-email';

/**
 * Unit tests for the `isValidEmail` utility function.
 * 
 * Ensures correct validation of email strings, including:
 */
describe('isValidEmail', () => {

  /**
   * Test case: valid email
   * Expected behavior: true
   */
  it('should return true for a valid email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name+tag+sorting@example.com')).toBe(true);
  });

  /**
   * Test case: invalid email
   * Expected behavior: false
   */
  it('should return false for an invalid email', () => {
    expect(isValidEmail('plainaddress')).toBe(false);
    expect(isValidEmail('@@example.com')).toBe(false);
    expect(isValidEmail('test@.com')).toBe(false);
    expect(isValidEmail('test@com')).toBe(false);
  });

  /**
   * Test case: empty string
   * Expected behavior: false
   */
  it('should return false for empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  /**
   * Test case: non-string inputs
   * Expected behavior: false
   */
  it('should return false for non-string inputs', () => {
    // @ts-expect-error intentionally passing invalid types to test robustness
    expect(isValidEmail(null)).toBe(false);
    // @ts-expect-error intentionally passing invalid types to test robustness
    expect(isValidEmail(undefined)).toBe(false);
    // @ts-expect-error intentionally passing invalid types to test robustness
    expect(isValidEmail(123)).toBe(false);
  });

});
