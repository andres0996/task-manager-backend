import { UserService } from '../../../../src/modules/users/application/user.service';
import { UserFirestoreRepository } from '../../../../src/modules/users/infrastructure/user.firestore.repository';
import { User } from '../../../../src/modules/users/domain/user.entity';
import { BadRequestError } from '../../../../src/shared/errors/bad-request.error';

/**
 * Unit tests for the `UserService` class.
 * Ensures correct behavior when creating users and handling existing emails.
 */
describe('UserService', () => {
  let service: UserService;
  let repositoryMock: jest.Mocked<UserFirestoreRepository>;

  // Setup a mocked repository before each test
  beforeEach(() => {
    repositoryMock = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<UserFirestoreRepository>;

    service = new UserService(repositoryMock);
  });

  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Group tests for createUser
  describe('createUser', () => {
    // Should create a new user if email does not exist
    it('should create a new user if email does not exist', async () => {
      const email = 'newuser@example.com';
      repositoryMock.findByEmail.mockResolvedValue(null);

      await service.createUser(email);

      // Verify repository methods were called correctly
      expect(repositoryMock.findByEmail).toHaveBeenCalledWith(email);
      expect(repositoryMock.create).toHaveBeenCalled();
    });

    // Should throw BadRequestError with a descriptive message if email already exists
    it('should throw BadRequestError with message "The email is already in use" if email already exists', async () => {
      const existingEmail = 'existing@example.com';
      const existingUser = new User(existingEmail);
      repositoryMock.findByEmail.mockResolvedValue(existingUser);

      await expect(service.createUser(existingEmail)).rejects.toThrow(
        `Email is already in use`
      );

      // Verify repository methods were called correctly
      expect(repositoryMock.findByEmail).toHaveBeenCalledWith(existingEmail);
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });
  })

  // Group tests for findUser
  describe('findUser', () => {
    // Should return an existing user if the email exists
    it('should return an existing user if the email exists', async () => {
      const existingEmail = 'existing@example.com';
      const existingUser = new User(existingEmail);
      repositoryMock.findByEmail.mockResolvedValue(existingUser);

      const result = await service.findUser(existingEmail);

      // Verify repository method was called correctly
      expect(repositoryMock.findByEmail).toHaveBeenCalledWith(existingEmail);

      // Verify that the returned user matches the mock
      expect(result).toBe(existingUser);
    });

    // Should throw BadRequestError if the email does not exist
    it('should throw BadRequestError with message "Email does not exist" if email does not exist', async () => {
      const email = 'nonexistent@example.com';
      repositoryMock.findByEmail.mockResolvedValue(null);

      await expect(service.findUser(email)).rejects.toThrow('Email does not exist');

      // Verify repository method was called correctly
      expect(repositoryMock.findByEmail).toHaveBeenCalledWith(email);
    });
  })


});
