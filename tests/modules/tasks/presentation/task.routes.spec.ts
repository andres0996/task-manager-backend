import request from 'supertest';
import express from 'express';
import { TaskController } from '../../../../src/modules/tasks/presentation/task.controller';
import { Task } from '../../../../src/modules/tasks/domain/task.entity';
import { AppError } from '../../../../src/shared/middlewares/error.middleware';

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

    // Mock the Task service using Jest
    taskServiceMock = {
      createTask: jest.fn(),
      findById: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
    };

    // Instantiate the controller using the mocked service
    controller = new TaskController(taskServiceMock);

    // Routes
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
      const mockTask = new Task({ userEmail: 'test@example.com', title: 'New Task', description: '' });
      taskServiceMock.createTask.mockResolvedValue(mockTask);

      const response = await request(app).post('/api/v1/tasks').send(mockTask);

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe(mockTask.title);
      expect(taskServiceMock.createTask).toHaveBeenCalledWith(
        mockTask.userEmail,
        mockTask.title,
        mockTask.description
      );
    });

    it('should return 400 if title is missing', async () => {
      const payload = { userEmail: 'test@example.com', description: '' };
      const response = await request(app).post('/api/v1/tasks').send(payload);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('title is required');
      expect(taskServiceMock.createTask).not.toHaveBeenCalled();
    });

    it('should return 400 if email is missing', async () => {
      const payload = { title: 'Task without email' };
      const response = await request(app).post('/api/v1/tasks').send(payload);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('userEmail is required');
      expect(taskServiceMock.createTask).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return 200 and task data when task exists', async () => {
      const mockTask = new Task({ userEmail: 'test@example.com', title: 'Task 1' });
      taskServiceMock.findById.mockResolvedValue(mockTask);

      const response = await request(app).get('/api/v1/tasks/task-id-abc');

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe(mockTask.title);
      expect(taskServiceMock.findById).toHaveBeenCalledWith('task-id-abc');
    });

    it('should return 404 if task does not exist', async () => {
      taskServiceMock.findById.mockRejectedValue(new AppError('Task not found', 404));

      const response = await request(app).get('/api/v1/tasks/nonexistent-id');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Task not found');
      expect(taskServiceMock.findById).toHaveBeenCalledWith('nonexistent-id');
    });
  });

  describe('deleteTask', () => {
    it('should return 200 when task is deleted successfully', async () => {
      taskServiceMock.deleteTask.mockResolvedValue(undefined);

      const response = await request(app).delete('/api/v1/tasks/task-id-abc');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');
      expect(taskServiceMock.deleteTask).toHaveBeenCalledWith('task-id-abc');
    });

    it('should return 404 if task does not exist', async () => {
      taskServiceMock.deleteTask.mockRejectedValue(new AppError('Task not found', 404));

      const response = await request(app).delete('/api/v1/tasks/nonexistent-id');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Task not found');
      expect(taskServiceMock.deleteTask).toHaveBeenCalledWith('nonexistent-id');
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
  
      // Mock del service: devuelve la tarea actualizada
      taskServiceMock.updateTask.mockResolvedValue({
        ...mockTask,
        title: 'Updated Task',
        completed: true,
      });
  
      const response = await request(app)
        .put(`/api/v1/tasks/${mockTask.id}`)
        .send({ title: 'Updated Task', completed: true });
  
      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Updated Task');
      expect(response.body.data.completed).toBe(true);
      expect(taskServiceMock.updateTask).toHaveBeenCalledWith(
        mockTask.id,
        'Updated Task',
        undefined,
        true
      );
    });
  
    it('should return 404 if task ID is missing', async () => {
      // Express devolverá 404 automáticamente si no hay :id
      const response = await request(app).put('/api/v1/tasks/').send({ title: 'No ID' });
      expect(response.status).toBe(404);
    });
  
    it('should return 404 if task not found', async () => {
      taskServiceMock.updateTask.mockRejectedValue(new AppError('Task not found', 404));
  
      const response = await request(app)
        .put('/api/v1/tasks/nonexistent-id')
        .send({ title: 'Update' });
  
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Task not found');
    });
  });
  
});
