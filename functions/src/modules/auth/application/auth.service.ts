/**
 * AuthService
 *
 * Handles all authentication-related business logic.
 */

import {UserFirestoreRepository} from "../../users/infrastructure/user.firestore.repository";
import {AppError} from "../../../shared/middlewares/error.middleware";
import {generateToken} from "../../../shared/utils/jwt.service";

export class AuthService {
  private userRepository: UserFirestoreRepository;

  constructor() {
    this.userRepository = new UserFirestoreRepository();
  }

  /**
   * Log in user by email.
   * Generate a JWT token if the user exists.
   *
   * @param userEmail - Email of the user
   * @return JWT string
   * @throws AppError if userEmail is missing or user does not exist
   */
  async login(userEmail: string): Promise<string> {
    if (!userEmail) {
      throw new AppError("userEmail is required", 400);
    }

    const user = await this.userRepository.findByEmail(userEmail);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const token = generateToken(userEmail);

    return token;
  }
}
