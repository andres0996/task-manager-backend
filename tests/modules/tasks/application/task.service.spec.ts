import { TaskService } from '../../../../src/modules/tasks/application/task.service';
import { Task } from '../../../../src/modules/tasks/domain/task.entity';
import { TaskFirestoreRepository } from '../../../../src/modules/tasks/infrastructure/task.firestore.repository';
import { UserService } from '../../../../src/modules/users/application/user.service';
import { BadRequestError } from '../../../../src/shared/errors/bad-request.error';
import { AppError } from '../../../../src/shared/middlewares/error.middleware';
import { CreateTaskDTO, UpdateTaskDTO } from '../../../../src/shared/dtos/task.dto';

/**
 * Unit tests for TaskService.
 * 
 */
describe('TaskService', () => {
  let repositoryMock: jest.Mocked<TaskFirestoreRepository>;
  let userServiceMock: jest.Mocked<UserService>;
  let service: TaskService;

  beforeEach(() => {
    repositoryMock = {
      create: jest.fn(),
      findAllByUser: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TaskFirestoreRepository>;

    userServiceMock = {
      findUser: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    service = new TaskService(repositoryMock, userServiceMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests for createTask method
   */
  describe('createTask', () => {
    const validDTO: CreateTaskDTO = {
      userEmail: 'test@example.com',
      title: 'New Task',
      description: 'Task description',
    };

    it('should create a new task if user exists', async () => {
      userServiceMock.findUser.mockResolvedValue({ email: validDTO.userEmail } as any);

      const task = await service.createTask(validDTO);

      expect(task.title).toBe(validDTO.title);
      expect(repositoryMock.create).toHaveBeenCalledWith(expect.objectContaining({
        userEmail: validDTO.userEmail,
        title: validDTO.title,
        description: validDTO.description,
      }));
    });

    it('should throw BadRequestError if userEmail is missing', async () => {
      await expect(
        service.createTask({ ...validDTO, userEmail: '' })
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if title is missing', async () => {
      await expect(
        service.createTask({ ...validDTO, title: '' })
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw AppError if user does not exist', async () => {
      userServiceMock.findUser.mockRejectedValue(new AppError('User does not exist', 404));
      await expect(service.createTask(validDTO)).rejects.toThrow(AppError);
    });
  });

  /**
   * Tests for findById method
   */
  describe('findById', () => {
    it('should return a task if found', async () => {
      const task = new Task({ userEmail: 'test@example.com', title: 'Task 1' });
      repositoryMock.findById.mockResolvedValue(task);

      const result = await service.findById('task-id-123');

      expect(result).toBe(task);
      expect(repositoryMock.findById).toHaveBeenCalledWith('task-id-123');
    });

    it('should throw AppError if task not found', async () => {
      repositoryMock.findById.mockResolvedValue(null);
      await expect(service.findById('task-id-123')).rejects.toThrow(AppError);
    });
  });

  /**
   * Tests for deleteTask method
   */
  describe('deleteTask', () => {
    it('should delete a task if it exists', async () => {
      const task = new Task({ userEmail: 'test@example.com', title: 'Task 1' });
      repositoryMock.findById.mockResolvedValue(task);
      repositoryMock.delete.mockResolvedValue();

      await service.deleteTask('task-id-abc');

      expect(repositoryMock.delete).toHaveBeenCalledWith('task-id-abc');
    });

    it('should throw AppError if task does not exist', async () => {
      repositoryMock.findById.mockResolvedValue(null);
      await expect(service.deleteTask('nonexistent-id')).rejects.toThrow(AppError);
      expect(repositoryMock.delete).not.toHaveBeenCalled();
    });
  });

  /**
   * Tests for updateTask method
   */
  describe('updateTask', () => {
    it('should update title and completed status', async () => {
      const existingTask = new Task({
        userEmail: 'test@example.com',
        title: 'Old Task',
        description: 'Old description',
        completed: false,
      });
      existingTask.id = 'task-id-abc';

      repositoryMock.findById.mockResolvedValue(existingTask);
      repositoryMock.update.mockImplementation(async (task) => task);

      const updatedTask = await service.updateTask(existingTask.id!, {
        title: 'Updated Task',
        completed: true,
      });

      expect(updatedTask.title).toBe('Updated Task');
      expect(updatedTask.completed).toBe(true);
      expect(updatedTask.completedAt).toBeInstanceOf(Date);
    });

    it('should throw AppError if task not found', async () => {
      repositoryMock.findById.mockResolvedValue(null);
      await expect(service.updateTask('task-id-abc', { title: 'X' })).rejects.toThrow(AppError);
      expect(repositoryMock.update).not.toHaveBeenCalled();
    });

    it('should set completedAt to null if marking completed false', async () => {
      const task = new Task({
        userEmail: 'test@example.com',
        title: 'Task',
        completed: true,
      });
      task.id = 'task-id-123';

      repositoryMock.findById.mockResolvedValue(task);
      repositoryMock.update.mockImplementation(async (t) => t);

      const updated = await service.updateTask(task.id!, { completed: false });

      expect(updated.completed).toBe(false);
      expect(updated.completedAt).toBeNull();
    });

    it('should not modify completedAt if completed is undefined', async () => {
      const task = new Task({
        userEmail: 'test@example.com',
        title: 'Task',
        completed: false,
      });
      task.id = 'task-id-123';

      repositoryMock.findById.mockResolvedValue(task);
      repositoryMock.update.mockImplementation(async (t) => t);

      const updated = await service.updateTask(task.id!, { title: 'New Title' });

      expect(updated.title).toBe('New Title');
      expect(updated.completedAt).toBeNull();
    });
  });

  /**
   * Tests for findAllByUser method
   */
  describe('findAllByUser', () => {
    it('should return all tasks for a valid user', async () => {
      userServiceMock.findUser.mockResolvedValue({ email: 'user@example.com' } as any);
      const mockTasks = [
        new Task({ userEmail: 'user@example.com', title: 'Task 1' }),
        new Task({ userEmail: 'user@example.com', title: 'Task 2' }),
      ];
      repositoryMock.findAllByUser.mockResolvedValue(mockTasks);

      const tasks = await service.findAllByUser('user@example.com');

      expect(tasks).toHaveLength(2);
      expect(repositoryMock.findAllByUser).toHaveBeenCalledWith('user@example.com');
    });

    it('should throw AppError if user does not exist', async () => {
      userServiceMock.findUser.mockRejectedValue(new AppError('User does not exist', 404));
      await expect(service.findAllByUser('nonexistent@example.com')).rejects.toThrow(AppError);
    });
  });
});