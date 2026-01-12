import { UserFirestoreRepository } from '../../users/infrastructure/user.firestore.repository';
import { AppError } from '../../../shared/middlewares/error.middleware';
import { generateToken } from '../../../shared/utils/jwt.service';

export class AuthService {
  private userRepository: UserFirestoreRepository;

  constructor() {
    this.userRepository = new UserFirestoreRepository();
  }

  /**
   * Log in user by email.
   * Generate a token JWT if exist users.
   *
   * @param userEmail - email user
   * @returns JWT string
   */
  async login(userEmail: string): Promise<string> {
    if (!userEmail) {
      throw new AppError('userEmail is required', 400);
    }

    const user = await this.userRepository.findByEmail(userEmail);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const token = generateToken(userEmail);

    return token;
  }
}
