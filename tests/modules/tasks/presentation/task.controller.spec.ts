import request from 'supertest';
import express from 'express';
import { TaskController } from '../../../../src/modules/tasks/presentation/task.controller';
import { TaskService } from '../../../../src/modules/tasks/application/task.service';
import { BadRequestError } from '../../../../src/shared/errors/bad-request.error';
import { NotFoundError } from '../../../../src/shared/errors/not-found.error';
import { Task } from '../../../../src/modules/tasks/domain/task.entity';
import { AppError } from '../../../../src/shared/middlewares/error.middleware';

/**
 * Unit tests for TaskController.
 * Ensures HTTP requests are handled correctly and proper status/messages are returned.
 */
describe('TaskController', () => {
  let app: express.Express;
  let taskServiceMock: jest.Mocked<TaskService>;
  let controller: TaskController;

  /**
   * Setup Express app and mock TaskService before each test.
   * The controller is injected with the mocked service.
   */
  beforeEach(() => {
    taskServiceMock = {
      createTask: jest.fn(),
      findById: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
    } as unknown as jest.Mocked<TaskService>;
  
    const controller = new TaskController(taskServiceMock);
  
    app = express();
    app.use(express.json());
    app.post('/api/v1/tasks', (req, res) => controller.createTask(req, res));
    app.get('/api/v1/tasks/:id', (req, res) => controller.findById(req, res));
    app.delete('/api/v1/tasks/:id', (req, res) => controller.deleteTask(req, res));
    app.put('/api/v1/tasks/:id', (req, res) => controller.updateTask(req, res));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      const payload = { userEmail: 'test@example.com', title: 'New Task', description: '' };
      const mockTask = new Task(payload);
    
      taskServiceMock.createTask.mockResolvedValue(mockTask);
    
      const response = await request(app).post('/api/v1/tasks').send(payload);
    
      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe(payload.title);
    
      expect(taskServiceMock.createTask).toHaveBeenCalledWith(
        payload.userEmail,
        payload.title,
        payload.description
      );
    });

    it('should return 400 if title is missing', async () => {
      taskServiceMock.createTask.mockRejectedValue(new BadRequestError('Task title is required'));

      const response = await request(app).post('/api/v1/tasks').send({ userEmail: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('title is required');
      expect(taskServiceMock.createTask).not.toHaveBeenCalled();
    });

    it('should return 400 if email is missing', async () => {
      taskServiceMock.createTask.mockRejectedValue(new BadRequestError('userEmail is required'));

      const response = await request(app).post('/api/v1/tasks').send({ title: 'Task without email' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('userEmail is required');
      expect(taskServiceMock.createTask).not.toHaveBeenCalled();
    });

    it('should return 404 if user does not exist', async () => {
      const payload = { userEmail: 'nonexistent@example.com', title: 'Task for missing user' };

      taskServiceMock.createTask.mockRejectedValue(new NotFoundError('User not found'));

      const response = await request(app).post('/api/v1/tasks').send(payload);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
      expect(taskServiceMock.createTask).toHaveBeenCalledWith(payload.userEmail, payload.title, undefined);
    });
  });

  describe('findTask', () => {
    it('should return 200 and task data when task exists', async () => {
      const task = new Task({ userEmail: 'test@example.com', title: 'Task 1' });
      taskServiceMock.findById.mockResolvedValue(task);
    
      const response = await request(app).get('/api/v1/tasks/task-id-abc');
    
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task retrieved successfully');
      expect(response.body.data.title).toBe(task.title);
    });
    
    it('should return 404 if task ID is missing', async () => {
      const response = await request(app).get('/api/v1/tasks/');
      expect(response.status).toBe(404);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      taskServiceMock.deleteTask.mockResolvedValue();
  
      const response = await request(app).delete('/api/v1/tasks/task-id-abc');
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');
      expect(taskServiceMock.deleteTask).toHaveBeenCalledWith('task-id-abc');
    });
  
    it('should return 404 if task not found', async () => {
      taskServiceMock.deleteTask.mockRejectedValue(new NotFoundError('Task not found'));
  
      const response = await request(app).delete('/api/v1/tasks/nonexistent-id');
  
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Task not found');
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const mockTask = new Task({
        userEmail: 'test@example.com',
        title: 'Old Task',
        description: 'Old description',
        completed: false,
      });
      mockTask.id = 'task-id-abc';

      taskServiceMock.updateTask.mockImplementation(async (id, title, description, completed) => {
        return new Task({
          userEmail: mockTask.userEmail,
          title: title ?? mockTask.title,
          description: description ?? mockTask.description,
          completed: completed ?? mockTask.completed,
          completedAt: completed ? new Date() : null,
        });
      });
    
      const response = await request(app)
        .put(`/api/v1/tasks/${mockTask.id}`)
        .send({ title: 'Updated Task' });
    
      expect(response.status).toBe(200);
    });
    
  
    it('should return 400 if task ID is missing', async () => {
      const response = await request(app).put('/api/v1/tasks/').send({ title: 'No ID' });
  
      expect(response.status).toBe(404);
    });
  
    it('should return 404 if task not found', async () => {
      taskServiceMock.updateTask.mockRejectedValue(new NotFoundError('Task not found'));
  
      const response = await request(app)
        .put('/api/v1/tasks/nonexistent-id')
        .send({ title: 'Update' });
  
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Task not found');
    });
  });

});
