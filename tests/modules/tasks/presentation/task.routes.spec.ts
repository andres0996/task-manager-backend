import request from 'supertest';
import express, { Express } from 'express';
import { TaskController } from '../../../../src/modules/tasks/presentation/task.controller';
import { TaskService } from '../../../../src/modules/tasks/application/task.service';
import { Task } from '../../../../src/modules/tasks/domain/task.entity';
import { authMiddleware } from '../../../../src/shared/middlewares/auth.middleware';

/**
 * Integration tests for Task Routes.
 * 
 */
jest.mock('../../../../src/shared/middlewares/auth.middleware', () => ({
  authMiddleware: (_req: any, _res: any, next: any) => next(),
}));

describe('Task Routes', () => {
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

    const router = express.Router();
    router.use(authMiddleware);

    router.post('/', (req, res) => controller.createTask(req, res));
    router.get('/:id', (req, res) => controller.findById(req, res));
    router.get('/user/:userEmail', (req, res) => controller.findAllByUser(req, res));
    router.put('/:id', (req, res) => controller.updateTask(req, res));
    router.delete('/:id', (req, res) => controller.deleteTask(req, res));

    app.use('/api/v1/tasks', router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests for creating a new task
   */
  describe('POST /api/v1/tasks', () => {
    it('should create a new task and return 201', async () => {
      const task = new Task({ userEmail: 'user@example.com', title: 'My Task' });
      taskServiceMock.createTask.mockResolvedValue(task);

      const response = await request(app)
        .post('/api/v1/tasks')
        .send({ userEmail: 'user@example.com', title: 'My Task' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Task created successfully');
      expect(taskServiceMock.createTask).toHaveBeenCalledWith({ userEmail: 'user@example.com', title: 'My Task' });
    });

    it('should return 400 if userEmail is missing', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({ title: 'Task without email' });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/userEmail/i);
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({ userEmail: 'user@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/title/i);
    });
  });

  /**
   * Tests for get a task
   */
  describe('GET /api/v1/tasks/:id', () => {
    it('should return a task if found', async () => {
      const task = new Task({ userEmail: 'user@example.com', title: 'Task 1' });
      taskServiceMock.findById.mockResolvedValue(task);

      const response = await request(app).get('/api/v1/tasks/task-id-123');

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Task 1');
      expect(taskServiceMock.findById).toHaveBeenCalledWith('task-id-123');
    });

    it('should return 500 if service throws', async () => {
      taskServiceMock.findById.mockRejectedValue(new Error('Unexpected'));

      const response = await request(app).get('/api/v1/tasks/task-id-123');
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Unexpected');
    });
  });

  /**
   * Tests for get tasks for user email
   */
  describe('GET /api/v1/tasks/user/:email', () => {
    it('should return all tasks for a user', async () => {
      const mockTasks = [new Task({ userEmail: 'user@example.com', title: 'Task 1' })];
      taskServiceMock.findAllByUser.mockResolvedValue(mockTasks);

      const response = await request(app).get('/api/v1/tasks/user/test@example.com');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(taskServiceMock.findAllByUser).toHaveBeenCalledWith('test@example.com');
    });
  });

  /**
   * Tests for update a task by id
   */
  describe('PUT /api/v1/tasks/:id', () => {
    it('should update a task', async () => {
      const updatedTask = new Task({ userEmail: 'user@example.com', title: 'Updated Task' });
      taskServiceMock.updateTask.mockResolvedValue(updatedTask);

      const response = await request(app)
        .put('/api/v1/tasks/task-id-123')
        .send({ title: 'Updated Task' });

      expect(response.status).toBe(200);
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
   * Tests for delete a task by id
   */
  describe('DELETE /api/v1/tasks/:id', () => {
    it('should delete a task', async () => {
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