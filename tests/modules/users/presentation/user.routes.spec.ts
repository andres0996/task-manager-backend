import request from 'supertest';
import app from '../../../../src/app';

/**
 * Integration tests for User Routes.
 * Ensures that the /api/v1/users endpoint handles requests correctly,
 */
describe('User Routes', () => {


  // Group tests for createUser
  describe('createUser', () => {
    // Positive case: should create a new user successfully
    it('POST /api/v1/users - should create a user', async () => {
      const email = `test${Date.now()}@example.com`;

      // Make POST request to create user
      const response = await request(app)
        .post('/api/v1/users')
        .send({ email });

      // Expect 201 Created
      expect(response.status).toBe(201);

      // Expect response body to include success message
      expect(response.body).toHaveProperty('message', 'User created successfully');

      // Expect response body data to include the provided email
      expect(response.body.data).toHaveProperty('email', email);

      // Expect response body data to include a createdAt timestamp
      expect(response.body.data).toHaveProperty('createdAt');
    });

    // Negative case: should return 400 if email is missing
    it('POST /api/v1/users - should return 400 if email is missing', async () => {
      // Make POST request without email
      const response = await request(app)
        .post('/api/v1/users')
        .send({});

      // Expect 400 Bad Request
      expect(response.status).toBe(400);

      // Expect error message to indicate missing email
      expect(response.body).toHaveProperty('message', 'Email is required');
    });
  })

  // Group tests for findUser
  describe('findUser', () => {
    // Positive case: should return 200 and user data if email exists
    it('GET /api/v1/users/email - should return a user if email exists', async () => {
      const email = `test${Date.now()}@example.com`;

      // First, create the user (reuse your POST route)
      await request(app).post('/api/v1/users').send({ email });

      // Then, find the user
      const response = await request(app)
        .get('/api/v1/users/email')
        .query({ email }); // pass email as query param

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'User found successfully');
      expect(response.body.data).toHaveProperty('email', email);
      expect(response.body.data).toHaveProperty('createdAt');
    });

    // Negative case: should return 400 if email does not exist
    it('GET /api/v1/users/email - should return 400 if email does not exist', async () => {
      const email = `nonexistent${Date.now()}@example.com`;

      const response = await request(app)
        .get('/api/v1/users/email')
        .query({ email });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email does not exist');
    });

    // Negative case: should return 400 if email query param is missing
    it('GET /api/v1/users/email - should return 400 if email query param is missing', async () => {
      const response = await request(app)
        .get('/api/v1/users/email'); // no email provided

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email is required');
    });
  });

});
