import request from 'supertest';
import express, { Express } from 'express';
import { UserController } from '../../../../src/modules/users/presentation/user.controller';
import { UserService } from '../../../../src/modules/users/application/user.service';
import { BadRequestError } from '../../../../src/shared/errors/bad-request.error';
import { User } from '../../../../src/modules/users/domain/user.entity';

/**
 * Unit tests for UserController.
 * Ensures HTTP requests are handled correctly and proper status/messages are returned.
 */
describe('UserController', () => {
  let app: Express;
  let userServiceMock: jest.Mocked<UserService>;

  beforeEach(() => {
    // Mock the UserService
    userServiceMock = {
      createUser: jest.fn(),
      findUser: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    // Create Express app and register controller
    app = express();
    app.use(express.json());
    const controller = new UserController(userServiceMock);
    app.post('/api/v1/users', (req, res) => controller.createUser(req, res));
    app.get('/api/v1/users/email', (req, res) => controller.findUser(req, res));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Group tests for createUser
  describe('createUser', () => {
    // Positive case: should return 201 when a new user is created successfully
    it('should return 201 and the user email on successful creation', async () => {
      const email = 'newuser@example.com';
      const mockUser = new User(email);
      userServiceMock.createUser.mockResolvedValue(mockUser);
      
      const response = await request(app)
        .post('/api/v1/users')
        .send({ email });
    
      expect(response.status).toBe(201);
      expect(response.body.data.email).toBe(email);
      expect(response.body.data.createdAt).toBeDefined();
      expect(userServiceMock.createUser).toHaveBeenCalledWith(email);
    });

    // Negative case: should return 400 if email already exists
    it('should return 400 when email is already in use', async () => {
      const email = 'existing@example.com';
      userServiceMock.createUser.mockRejectedValue(
        new BadRequestError('Email is already in use')
      );
    
      const response = await request(app)
        .post('/api/v1/users')
        .send({ email });
    
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email is already in use');
      expect(userServiceMock.createUser).toHaveBeenCalledWith(email);
    });

    // Negative case: should return 400 if no email is provided
    it('should return 400 if email is missing in request body', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/email/i);
      expect(userServiceMock.createUser).not.toHaveBeenCalled();
    });
  })

  // Group tests for findUser
  describe('findUser', () => {
    // Positive case: should return 200 and user data if email exists
    it('should return 200 and the user email if email exists', async () => {
      const email = 'existing@example.com';
      const mockUser = new User(email);
      userServiceMock.findUser.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/v1/users/email')
        .query({ email }); // query param instead of body

      expect(response.status).toBe(200); // 200 OK
      expect(response.body.data.email).toBe(email);
      expect(response.body.data.createdAt).toBeDefined();
      expect(userServiceMock.findUser).toHaveBeenCalledWith(email);
    });

    // Negative case: should return 400 if email does not exist
    it('should return 400 with message "Email does not exist" if email does not exist', async () => {
      const email = 'nonexistent@example.com';
      userServiceMock.findUser.mockRejectedValue(
        new BadRequestError('Email does not exist')
      );

      const response = await request(app)
        .get('/api/v1/users/email')
        .query({ email });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email does not exist');
      expect(userServiceMock.findUser).toHaveBeenCalledWith(email);
    });

    // Negative case: should return 400 if no email is provided
    it('should return 400 if email query param is missing', async () => {
      const response = await request(app)
        .get('/api/v1/users/email'); // no query param

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/email/i);
      expect(userServiceMock.findUser).not.toHaveBeenCalled();
    });
  });
});
