import request from 'supertest';
import app from '../../../../../functions/src/app';
import { UserResponseDTO } from '../../../../../functions/src/shared/dtos/user.dto';

/**
 * Integration tests for User Routes.
 * 
 */
describe('User Routes', () => {

  /**
   * Tests for creating a new user
   */
  describe('createUser', () => {

    /**
     * Positive case: should create a new user successfully
     * POST /api/v1/users
     * Expects 201 Created and returns UserDTO
     */
    it('POST /api/v1/users - should create a user', async () => {
      const email = `test${Date.now()}@example.com`;

      const response = await request(app)
        .post('/api/v1/users')
        .send({ email });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User created successfully');

      const user: UserResponseDTO = response.body.data;
      expect(user).toHaveProperty('email', email);
      expect(user).toHaveProperty('createdAt');
    });

    /**
     * Negative case: should return 400 if email is missing
     */
    it('POST /api/v1/users - should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email is required');
    });
  });

  /**
   * Tests for finding a user by email
   */
  describe('findUser', () => {

    /**
     * Positive case: should return 200 and UserDTO if email exists
     * GET /api/v1/users/email?email=<email>
     */
    it('GET /api/v1/users/email - should return a user if email exists', async () => {
      const email = `test${Date.now()}@example.com`;

      await request(app).post('/api/v1/users').send({ email });

      const response = await request(app)
        .get('/api/v1/users/email')
        .query({ email });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'User found successfully');

      const user: UserResponseDTO = response.body.data;
      expect(user).toHaveProperty('email', email);
      expect(user).toHaveProperty('createdAt');
    });

    /**
     * Negative case: should return 400 if email does not exist
     */
    it('GET /api/v1/users/email - should return 400 if email does not exist', async () => {
      const email = `nonexistent${Date.now()}@example.com`;

      const response = await request(app)
        .get('/api/v1/users/email')
        .query({ email });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email does not exist');
    });

    /**
     * Negative case: should return 400 if email query param is missing
     */
    it('GET /api/v1/users/email - should return 400 if email query param is missing', async () => {
      const response = await request(app)
        .get('/api/v1/users/email');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email is required');
    });
  });

});