import request from 'supertest';
import express, { Express } from 'express';
import { UserController } from '../../../../src/modules/users/presentation/user.controller';
import { UserService } from '../../../../src/modules/users/application/user.service';
import { BadRequestError } from '../../../../src/shared/errors/bad-request.error';

/**
 * Unit tests for UserController.
 * 
 */
describe('UserController', () => {
  let app: Express;
  let userServiceMock: jest.Mocked<UserService>;

  beforeEach(() => {

    userServiceMock = {
      createUser: jest.fn(),
      findUser: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    app = express();
    app.use(express.json());
    const controller = new UserController(userServiceMock);
    app.post('/api/v1/users', (req, res) => controller.createUser(req, res));
    app.get('/api/v1/users/email', (req, res) => controller.findUser(req, res));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests for createUser endpoint
   */
  describe('createUser', () => {

    it('should return 201 and the user on successful creation', async () => {
      const email = 'newuser@example.com';
      const mockUser = { email, createdAt: new Date() };
      userServiceMock.createUser.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/v1/users')
        .send({ email });

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(mockUser);
      expect(userServiceMock.createUser).toHaveBeenCalledWith(email);
    });

    it('should return 400 if email is already in use', async () => {
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

    it('should return 400 if email is missing in request body', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/email/i);
      expect(userServiceMock.createUser).not.toHaveBeenCalled();
    });
  });

  /**
   * Tests for findUser endpoint
   */
  describe('findUser', () => {
    it('should return 200 and the user DTO if email exists', async () => {
      const email = 'existing@example.com';
      const mockUser = { email, createdAt: new Date() };
      userServiceMock.findUser.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/v1/users/email')
        .query({ email });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUser);
      expect(userServiceMock.findUser).toHaveBeenCalledWith(email);
    });

    it('should return 400 with message if email does not exist', async () => {
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

    it('should return 400 if email query param is missing', async () => {
      const response = await request(app)
        .get('/api/v1/users/email');

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/email/i);
      expect(userServiceMock.findUser).not.toHaveBeenCalled();
    });
  });
});