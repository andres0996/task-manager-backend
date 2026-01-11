import { IUserRepository } from '../domain/user.repository.interface';
import { User } from '../domain/user.entity';
import { BadRequestError } from '../../../shared/errors/bad-request.error';

/**
 * Application service for User entity.
 * Handles use cases and business logic related to users.
 */
export class UserService {
  constructor(private readonly repository: IUserRepository) {}

  /**
   * Creates a new user if the email does not exist.
   *
   * @param email - Email address for the new user
   * @returns The created User instance
   * @throws BadRequestError if email is already in use
   */
  async createUser(email: string): Promise<User> {
    // Check if a user with the same email already exists
    const existingUser = await this.repository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestError('Email is already in use');
    }

    // Create a new User entity
    const user = new User(email);

    // Persist the new user in the repository
    await this.repository.create(user);

    return user;
  }
}
