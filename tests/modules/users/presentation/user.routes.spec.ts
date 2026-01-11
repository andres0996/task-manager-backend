import request from 'supertest';
import app from '../../../../src/app';

/**
 * Integration tests for User Routes.
 * Ensures that the /api/v1/users endpoint handles requests correctly,
 */
describe('User Routes', () => {

  // Positive case: should create a new user successfully
  it('POST /api/v1/users - should create a user', async () => {
    const email = 'test@example.com';

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

});
