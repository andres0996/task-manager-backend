import request from 'supertest';
import express from 'express';
import { TaskController } from '../../../../src/modules/tasks/presentation/task.controller';
import { Task } from '../../../../src/modules/tasks/domain/task.entity';
import { BadRequestError } from '../../../../src/shared/errors/bad-request.error';
import { mock } from 'node:test';

/**
 * Integration tests for Task Routes.
 * Ensures that the /api/v1/tasks endpoint handles requests correctly.
 */
describe('TaskController Routes', () => {
  let app: express.Express;
  let taskServiceMock: any;
  let controller: TaskController;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Mock the Task service using Jest to intercept calls
    taskServiceMock = {
      createTask: jest.fn(),
      getTasksByUser: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
    };

    // Instantiate the controller using the mocked service
    controller = new TaskController(taskServiceMock);

    // Define the POST route for creating tasks
    app.post('/api/v1/tasks', (req, res) => controller.createTask(req, res));
  });

  afterEach(() => {
    // Clear all mocks between tests
    jest.clearAllMocks();
  });


  describe('createTask', () => {
    /**
     * Positive case: successfully creates a new task
     * - Verifies the response status is 201
     * - Verifies the task title in the response matches the payload
     * - Verifies that the service's createTask method was called with correct data
     */
    it('should create a new task successfully', async () => {
      const mockTask = new Task({ userEmail: 'test@example.com', title: 'New Task', description:''});
      
      taskServiceMock.createTask.mockResolvedValue(mockTask);

      const response = await request(app).post('/api/v1/tasks').send(mockTask);

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe(mockTask.title);
      expect(taskServiceMock.createTask).toHaveBeenCalledWith(
        mockTask.userEmail,
        mockTask.title,
        mockTask.description);
    });

    /**
     * Negative case: returns 400 if title is missing
     * - Simulates an error thrown by BadRequestError
     * - Verifies the response status is 400
     * - Verifies that the error message is correct
     * - Verifies that createTask method of the service was NOT called
     */
    it('should return 400 if title is missing', async () => {
      const payload = { userEmail: 'user@example.com', description : '' };
    
      const response = await request(app).post('/api/v1/tasks').send(payload);
    
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('title is required');

      expect(taskServiceMock.createTask).not.toHaveBeenCalled();
    });

    /**
     * Negative case: returns 400 if userEmail is missing
     * - Simulates an error thrown by BadRequestError
     * - Verifies the response status is 400
     * - Verifies that the error message is correct
     * - Verifies that createTask method of the service was NOT called
     */
    it('should return 400 if email is missing', async () => {
      const payload = { title: 'Task without email' }; // userEmail missing
    
      const response = await request(app).post('/api/v1/tasks').send(payload);
    
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('userEmail is required');
    
      expect(taskServiceMock.createTask).not.toHaveBeenCalled();
    });
  });

  
});
