import { isValidEmail } from '../../../src/shared/utils/validate-email';

/**
 * Unit tests for the `isValidEmail` utility function.
 * Ensures correct validation of email strings, including:
 *  - Valid emails
 *  - Invalid emails
 *  - Edge cases (empty string)
 *  - Non-string inputs (robustness)
 */
describe('isValidEmail', () => {

  // Valid emails should return true
  it('should return true for a valid email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name+tag+sorting@example.com')).toBe(true);
  });

  // Invalid emails should return false
  it('should return false for an invalid email', () => {
    expect(isValidEmail('plainaddress')).toBe(false);
    expect(isValidEmail('@@example.com')).toBe(false);
    expect(isValidEmail('test@.com')).toBe(false);
    expect(isValidEmail('test@com')).toBe(false);
  });

  // Edge case: empty string
  it('should return false for empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  // Non-string inputs should be rejected
  it('should return false for non-string inputs', () => {
    // @ts-expect-error intentionally passing invalid types to test robustness
    expect(isValidEmail(null)).toBe(false);
    // @ts-expect-error intentionally passing invalid types to test robustness
    expect(isValidEmail(undefined)).toBe(false);
    // @ts-expect-error intentionally passing invalid types to test robustness
    expect(isValidEmail(123)).toBe(false);
  });

});
