import request from 'supertest';
import express, { Express } from 'express';
import { TaskController } from '../../../../../functions/src/modules/tasks/presentation/task.controller';
import { TaskService } from '../../../../../functions/src/modules/tasks/application/task.service';
import { Task } from '../../../../../functions/src/modules/tasks/domain/task.entity';
import { AppError } from '../../../../../functions/src/shared/middlewares/error.middleware';

/**
 * Unit tests for TaskController.
 * 
 * Tests all HTTP endpoints of TaskController with positive and negative scenarios.
 */
describe('TaskController', () => {
  let app: Express;
  let taskServiceMock: jest.Mocked<TaskService>;

  beforeEach(() => {
    taskServiceMock = {
      createTask: jest.fn(),
      findById: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      findAllByUser: jest.fn(),
    } as unknown as jest.Mocked<TaskService>;

    const controller = new TaskController(taskServiceMock);

    app = express();
    app.use(express.json());

    app.post('/api/v1/tasks', (req, res) => controller.createTask(req, res));
    app.get('/api/v1/tasks/user/:userEmail', (req, res) => controller.findAllByUser(req, res));
    app.get('/api/v1/tasks/:id', (req, res) => controller.findById(req, res));
    app.put('/api/v1/tasks/:id', (req, res) => controller.updateTask(req, res));
    app.delete('/api/v1/tasks/:id', (req, res) => controller.deleteTask(req, res));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests for `createTask` method
   */
  describe('createTask', () => {
    it('should return 201 and the task data on successful creation', async () => {
      const task = new Task({ userEmail: 'user@example.com', title: 'New Task' });
      taskServiceMock.createTask.mockResolvedValue(task);

      const response = await request(app)
        .post('/api/v1/tasks')
        .send({ userEmail: 'user@example.com', title: 'New Task' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Task created successfully');
      expect(response.body.data.email).toBeUndefined();
      expect(response.body.data.userEmail).toBe('user@example.com');
      expect(taskServiceMock.createTask).toHaveBeenCalledWith({
        userEmail: 'user@example.com',
        title: 'New Task',
      });
    });

    it('should return 400 if userEmail is missing', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({ title: 'Task without email' });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/userEmail/i);
      expect(taskServiceMock.createTask).not.toHaveBeenCalled();
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({ userEmail: 'user@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/title/i);
      expect(taskServiceMock.createTask).not.toHaveBeenCalled();
    });
  });

  /**
   * Tests for `findAllByUser` method
   */
  describe('findAllByUser', () => {
    it('should return 200 and list of tasks', async () => {
      const tasks = [
        new Task({ userEmail: 'user@example.com', title: 'Task 1' }),
        new Task({ userEmail: 'user@example.com', title: 'Task 2' }),
      ];
      taskServiceMock.findAllByUser.mockResolvedValue(tasks);

      const response = await request(app).get('/api/v1/tasks/user/user@example.com');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Tasks retrieved successfully');
      expect(response.body.data).toHaveLength(2);
      expect(taskServiceMock.findAllByUser).toHaveBeenCalledWith('user@example.com');
    });
  });

  /**
   * Tests for `findById` method
   */
  describe('findById', () => {
    it('should return 200 and task data if found', async () => {
      const task = new Task({ userEmail: 'user@example.com', title: 'Task 1' });
      taskServiceMock.findById.mockResolvedValue(task);

      const response = await request(app).get('/api/v1/tasks/task-id-123');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task retrieved successfully');
      expect(response.body.data.title).toBe('Task 1');
      expect(taskServiceMock.findById).toHaveBeenCalledWith('task-id-123');
    });

    it('should return 500 if taskService throws', async () => {
      taskServiceMock.findById.mockRejectedValue(new AppError('Not found', 404));

      const response = await request(app).get('/api/v1/tasks/nonexistent-id');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Not found');
    });
  });

  /**
   * Tests for `updateTask` method
   */
  describe('updateTask', () => {
    it('should return 200 and updated task', async () => {
      const updatedTask = new Task({ userEmail: 'user@example.com', title: 'Updated Task' });
      taskServiceMock.updateTask.mockResolvedValue(updatedTask);

      const response = await request(app)
        .put('/api/v1/tasks/task-id-123')
        .send({ title: 'Updated Task' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task updated successfully');
      expect(response.body.data.title).toBe('Updated Task');
      expect(taskServiceMock.updateTask).toHaveBeenCalledWith('task-id-123', { title: 'Updated Task' });
    });

    it('should return 400 if id param is missing', async () => {
      const response = await request(app)
        .put('/api/v1/tasks/')
        .send({ title: 'Updated Task' });

      expect(response.status).toBe(404);
    });
  });

  /**
   * Tests for `deleteTask` method
   */
  describe('deleteTask', () => {
    it('should return 200 and success message', async () => {
      taskServiceMock.deleteTask.mockResolvedValue();

      const response = await request(app).delete('/api/v1/tasks/task-id-123');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');
      expect(taskServiceMock.deleteTask).toHaveBeenCalledWith('task-id-123');
    });

    it('should return 400 if id param is missing', async () => {
      const response = await request(app).delete('/api/v1/tasks/');

      expect(response.status).toBe(404);
    });
  });
});