/**
 * User Entity
 *
 * Represents a user in the system.
 * Encapsulates user properties and validation logic.
 *
 */

import {isValidEmail} from "../../../shared/utils/validate-email";

export class User {
  public readonly email: string;
  public readonly createdAt: Date;

  /**
   * Constructs a new User entity.
   *
   * @param email - User's email (must be unique in the system)
   * @param createdAt - Optional creation timestamp (defaults to now)
   * @throws Error if email is invalid
   */
  constructor(email: string, createdAt?: Date) {
    if (!email || !isValidEmail(email)) {
      throw new Error("User must have a valid email");
    }

    this.email = email;
    this.createdAt = createdAt ?? new Date();
  }
}
