/**
 * UserService
 *
 * Application service for the User entity.
 *
 */

import { IUserRepository } from '../domain/user.repository.interface';
import { User } from '../domain/user.entity';
import { BadRequestError } from '../../../shared/errors/bad-request.error';

export class UserService {
  /**
   * Creates an instance of UserService.
   *
   * @param repository - An implementation of IUserRepository for persistence operations
   */
  constructor(private readonly repository: IUserRepository) {}

  /**
   * Creates a new user if the email does not exist.
   *
   * @param email - Email for the new user
   * @returns The created User instance
   * @throws BadRequestError if email is already in use
   */
  async createUser(email: string): Promise<User> {
    // Check if a user with the same email already exists
    const existingUser = await this.repository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestError('Email is already in use');
    }

    const user = new User(email);

    await this.repository.create(user);

    return user;
  }

  /**
   * Finds an existing user by email.
   *
   * @param email - Email of the user to find
   * @returns The existing User instance
   * @throws BadRequestError if user with given email does not exist
   */
  async findUser(email: string): Promise<User> {
    const existingUser = await this.repository.findByEmail(email);

    if (!existingUser) {
      throw new BadRequestError('Email does not exist');
    }

    return existingUser;
  }
}
