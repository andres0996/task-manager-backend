import { isValidEmail } from '../../../shared/utils/validate-email';

/**
 * Represents a User entity in the system.
 * Encapsulates the properties and validation logic for a user.
 */
export class User {
  public readonly email: string;   // User's email address
  public readonly createdAt: Date; // Timestamp when the user was created

  /**
   * Constructs a new User entity.
   *
   * @param email - User's email address (must be unique in the system)
   * @param createdAt - Optional creation timestamp (defaults to now)
   * @throws Error if email are invalid
   */
  constructor(email: string, createdAt?: Date) {
    // Validate that the email exists and has a correct format
    if (!email || !isValidEmail(email)) {
      throw new Error('User must have a valid email');
    }
  
    // Assign properties
    this.email = email;
    this.createdAt = createdAt ?? new Date();
  }
}
