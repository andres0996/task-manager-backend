import { AuthService } from '../../../../src/modules/auth/application/auth.service';
import { UserFirestoreRepository } from '../../../../src/modules/users/infrastructure/user.firestore.repository';
import { AppError } from '../../../../src/shared/middlewares/error.middleware';
import { generateToken } from '../../../../src/shared/utils/jwt.service';

jest.mock('../../../../src/modules/users/infrastructure/user.firestore.repository');
jest.mock('../../../../src/shared/utils/jwt.service');

/**
 * Unit tests for `AuthService`.
 *
 */
describe('AuthService', () => {
  let authService: AuthService;
  let userRepositoryMock: jest.Mocked<UserFirestoreRepository>;

  beforeEach(() => {
    userRepositoryMock = new UserFirestoreRepository() as jest.Mocked<UserFirestoreRepository>;
    authService = new AuthService();

    (authService as any).userRepository = userRepositoryMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Should return a token if the user exists
   */
  it('should return a token if user exists', async () => {
    const email = 'test@example.com';
    const mockUser = { userEmail: email };

    userRepositoryMock.findByEmail.mockResolvedValue(mockUser as any);
    (generateToken as jest.Mock).mockReturnValue('mocked-token');

    const token = await authService.login(email);

    expect(token).toBe('mocked-token');
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
    expect(generateToken).toHaveBeenCalledWith(email);
  });

  /**
   * Should throw 400 if userEmail is missing
   */
  it('should throw 400 if userEmail is missing', async () => {
    await expect(authService.login('')).rejects.toThrow(AppError);
    await expect(authService.login('')).rejects.toMatchObject({
      message: 'userEmail is required',
      statusCode: 400,
    });
  });

  /**
   * Should throw 404 if user does not exist
   */
  it('should throw 404 if user does not exist', async () => {
    const email = 'notfound@example.com';
    userRepositoryMock.findByEmail.mockResolvedValue(null);

    await expect(authService.login(email)).rejects.toThrow(AppError);
    await expect(authService.login(email)).rejects.toMatchObject({
      message: 'User not found',
      statusCode: 404,
    });
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
  });
});
