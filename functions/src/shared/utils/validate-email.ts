/**
 * Email validation utility.
 *
 * Provides helper functions to validate email addresses
 * for proper format before using them in user registration
 * or login processes.
 */

/**
 * Validates if a string is a proper email format.
 *
 * @param email - The email string to validate
 * @return true if valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
