import { User } from './user.entity';

/**
 * Interface for User repository.
 * Defines the contract for any implementation that handles User persistence.
 */
export interface IUserRepository {
  /**
   * Finds a user by their email.
   * @param email - The email to search for
   * @returns User if found, null otherwise
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Persists a new user in the repository.
   * @param user - The User entity to save
   */
  create(user: User): Promise<void>;
}
