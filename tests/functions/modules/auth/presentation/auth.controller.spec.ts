import request from 'supertest';
import express from 'express';
import { AuthController } from '../../../../../functions/src/modules/auth/presentation/auth.controller';
import { AuthService } from '../../../../../functions/src/modules/auth/application/auth.service';
import { AppError } from '../../../../../functions/src/shared/middlewares/error.middleware';

/**
 * Unit tests for `AuthController` routes.
 *
 */
describe('AuthController Routes', () => {
  let app: express.Express;
  let authServiceMock: any;
  let controller: AuthController;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    authServiceMock = {
      login: jest.fn(),
    };

    controller = new AuthController(authServiceMock);

    app.post('/api/v1/auth/login', (req, res) => controller.login(req, res));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Should return 200 OK and token when valid email is provided
   */
  it('should return 200 and token for valid email', async () => {
    const mockToken = 'jwt-token-example';
    authServiceMock.login.mockResolvedValue(mockToken);

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ userEmail: 'test@example.com' });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe(mockToken);
    expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com');
  });

  /**
   * Should return 400 Bad Request if userEmail is missing
   */
  it('should return 400 if email is missing', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('userEmail is required');
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  /**
   * Should return 400 Bad Request if login fails due to service error
   */
  it('should return 400 if login fails', async () => {
    authServiceMock.login.mockRejectedValue(new AppError('Invalid email', 400));

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ userEmail: 'invalid@example.com' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid email');
    expect(authServiceMock.login).toHaveBeenCalledWith('invalid@example.com');
  });
});