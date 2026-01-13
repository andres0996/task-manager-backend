import jwt from 'jsonwebtoken';
import { authMiddleware } from '../../../src/shared/middlewares/auth.middleware';

/**
 * Unit tests for the authentication middleware.
 * 
 * Ensures that JWTs are properly verified and that the middleware
 * correctly sets the userEmail in the request object or returns 401.
 */
describe('authMiddleware', () => {

  const mockReq: any = { headers: {} };
  const mockRes: any = { 
    status: jest.fn().mockReturnThis(), 
    json: jest.fn() 
  };
  const mockNext = jest.fn();

  beforeEach(() => {

    jest.clearAllMocks();
  });

  /**
   * Test case: valid JWT token
   * Expected behavior: next() is called and userEmail is set on req
   */
  it('should call next and set userEmail if token is valid', () => {
    const token = jwt.sign({ email: 'test@example.com' }, process.env.JWT_SECRET!);
    mockReq.headers.authorization = `Bearer ${token}`;

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.userEmail).toBe('test@example.com');
  });

  /**
   * Test case: missing authorization header
   * Expected behavior: returns 401 with "Token missing" message
   */
  it('should return 401 if token is missing', () => {
    mockReq.headers.authorization = undefined;

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token missing' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  /**
   * Test case: invalid JWT token
   * Expected behavior: returns 401 with "Invalid token" message
   */
  it('should return 401 if token is invalid', () => {
    mockReq.headers.authorization = 'Bearer invalidtoken';

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
