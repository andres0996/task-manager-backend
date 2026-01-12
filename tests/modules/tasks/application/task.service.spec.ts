import { TaskService } from '../../../../src/modules/tasks/application/task.service';
import { Task } from '../../../../src/modules/tasks/domain/task.entity';
import { TaskFirestoreRepository } from '../../../../src/modules/tasks/infrastructure/task.firestore.repository';
import { UserService } from '../../../../src/modules/users/application/user.service';
import { BadRequestError } from '../../../../src/shared/errors/bad-request.error';

/**
 * Unit tests for TaskService.
 * Ensures correct behavior for task-related use cases and business logic.
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

    // Inject both repository and userService into TaskService
    service = new TaskService(repositoryMock, userServiceMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a new task if user exists', async () => {
      // Mock the user exists
      userServiceMock.findUser.mockResolvedValue({ email: 'test@example.com', createdAt: new Date() } as any);

      await service.createTask('test@example.com', 'New Task');

      // Ensure repository.create was called with the task
      expect(repositoryMock.create).toHaveBeenCalledWith(expect.objectContaining({
        userEmail: 'test@example.com',
        title: 'New Task',
      }));
    });

    it('should throw an error if user does not exist', async () => {
      // Mock the user does not exist
      userServiceMock.findUser.mockRejectedValue(new BadRequestError('Email does not exist'));

      await expect(service.createTask('nonexistent@example.com', 'Task Title'))
        .rejects
        .toThrow('Email does not exist');

      expect(repositoryMock.create).not.toHaveBeenCalled();
    });

    it('should throw an error if title is missing', async () => {
      userServiceMock.findUser.mockResolvedValue({ email: 'test@example.com', createdAt: new Date() } as any);

      await expect(service.createTask('test@example.com', ''))
        .rejects
        .toThrow('Task title is required');

      expect(repositoryMock.create).not.toHaveBeenCalled();
    });
  });
});
