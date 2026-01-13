import request from 'supertest';
import express from 'express';
import { AuthController } from '../../../../src/modules/auth/presentation/auth.controller';
import { AppError } from '../../../../src/shared/middlewares/error.middleware';

/**
 * Unit tests for AuthController HTTP endpoints.
 *
 */
describe('Auth Routes', () => {
  let app: express.Express;
  let authServiceMock: any;
  let controller: AuthController;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Mocked AuthService
    authServiceMock = {
      login: jest.fn(),
      verifyToken: jest.fn(),
    };

    // Controller with mocked service
    controller = new AuthController(authServiceMock);

    // Setup login route
    app.post('/api/v1/auth/login', (req, res) => controller.login(req, res));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Should return 200 OK with a JWT token when a valid email is provided
   */
  it('should return 200 and a token for a valid email', async () => {
    const mockToken = 'jwt.mock.token';
    authServiceMock.login.mockResolvedValue(mockToken);

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ userEmail: 'test@example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token', mockToken);
    expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com');
  });

  /**
   * Should return 400 Bad Request if userEmail is missing in the request body
   */
  it('should return 400 if email is missing', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'userEmail is required');
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  /**
   * Should return 500 Internal Server Error if login throws an unexpected error
   */
  it('should return 500 if login throws unexpected error', async () => {
    authServiceMock.login.mockRejectedValue(new Error('Unexpected error'));

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ userEmail: 'test@example.com' });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Unexpected error');
  });
});