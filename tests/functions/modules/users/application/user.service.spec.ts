import { UserService } from '../../../../../functions/src/modules/users/application/user.service';
import { UserFirestoreRepository } from '../../../../../functions/src/modules/users/infrastructure/user.firestore.repository';
import { BadRequestError } from '../../../../../functions/src/shared/errors/bad-request.error';
import { UserResponseDTO } from '../../../../../functions/src/shared/dtos/user.dto';

/**
 * Unit tests for the `UserService` class.
 * 
 */
describe('UserService', () => {
  let service: UserService;
  let repositoryMock: jest.Mocked<UserFirestoreRepository>;

  beforeEach(() => {
    repositoryMock = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<UserFirestoreRepository>;

    service = new UserService(repositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests for createUser method
   */
  describe('createUser', () => {
    it('should create a new user if email does not exist', async () => {
      const email = 'newuser@example.com';
      repositoryMock.findByEmail.mockResolvedValue(null);

      const user: UserResponseDTO = await service.createUser(email);

      expect(repositoryMock.findByEmail).toHaveBeenCalledWith(email);
      expect(repositoryMock.create).toHaveBeenCalled();
      expect(user.email).toBe(email);
      expect(user.createdAt).toBeDefined();
    });

    it('should throw BadRequestError if email already exists', async () => {
      const existingEmail = 'existing@example.com';
      const existingUser: UserResponseDTO = { email: existingEmail, createdAt: new Date() };
      repositoryMock.findByEmail.mockResolvedValue(existingUser as any);

      await expect(service.createUser(existingEmail)).rejects.toThrow(
        'Email is already in use'
      );

      expect(repositoryMock.findByEmail).toHaveBeenCalledWith(existingEmail);
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });
  });

  /**
   * Tests for findUser method
   */
  describe('findUser', () => {
    it('should return an existing user if the email exists', async () => {
      const existingEmail = 'existing@example.com';
      const existingUser: UserResponseDTO = { email: existingEmail, createdAt: new Date() };
      repositoryMock.findByEmail.mockResolvedValue(existingUser as any);

      const result: UserResponseDTO = await service.findUser(existingEmail);

      expect(repositoryMock.findByEmail).toHaveBeenCalledWith(existingEmail);
      expect(result).toEqual(existingUser);
    });

    it('should throw BadRequestError if the email does not exist', async () => {
      const email = 'nonexistent@example.com';
      repositoryMock.findByEmail.mockResolvedValue(null);

      await expect(service.findUser(email)).rejects.toThrow('Email does not exist');

      expect(repositoryMock.findByEmail).toHaveBeenCalledWith(email);
    });
  });
});
