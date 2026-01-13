import { TaskFirestoreRepository } from '../../../../src/modules/tasks/infrastructure/task.firestore.repository';
import { Task } from '../../../../src/modules/tasks/domain/task.entity';
import { db } from '../../../../src/config/firebase';

/**
 * Unit tests for `TaskFirestoreRepository`.
 * Ensures correct interaction with Firestore for User entity.
 * 
 */
jest.mock('../../../../src/config/firebase', () => {
  const addMock = jest.fn();
  const docMock = jest.fn(() => ({
    get: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }));
  return {
    db: {
      collection: jest.fn(() => ({
        add: addMock,
        doc: docMock,
      })),
    },
  };
});

describe('TaskFirestoreRepository', () => {
  let repository: TaskFirestoreRepository;
  let collectionMock: any;

  beforeEach(() => {
    repository = new TaskFirestoreRepository();
    collectionMock = {
      add: jest.fn(),
      doc: jest.fn((id) => ({
        get: jest.fn(),
      })),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests for create method
   */
  describe('create', () => {
    it('should call add with correct data when creating a task', async () => {
      const task = new Task({
        title: 'My Task',
        userEmail: 'test@example.com',
        description: 'Test description',
      });

      await repository.create(task);

      const collectionInstance = (db.collection as jest.Mock).mock.results[0].value;

      expect(collectionInstance.add).toHaveBeenCalledTimes(1);
      expect(collectionInstance.add).toHaveBeenCalledWith({
        userEmail: task.userEmail,
        title: task.title,
        description: task.description,
        completed: task.completed,
        createdAt: task.createdAt,
      });
    });
  });

  /**
   * Tests for findById method
   */
  describe('find', () => {
    it('should return a Task when found', async () => {
      const docMock = {
        exists: true,
        data: () => ({
          userEmail: 'test@example.com',
          title: 'Task 1',
          description: '',
          completed: false,
          completedAt: null,
        }),
      };

      const collectionInstance = (db.collection as jest.Mock).mock.results[0].value;
      (collectionInstance.doc as jest.Mock).mockReturnValue({
        get: jest.fn().mockResolvedValue(docMock),
      });

      const task = await repository.findById('task-id-abc');

      expect(task?.title).toBe('Task 1');
    });
  });

  /**
   * Tests for delete method
   */
  describe('delete', () => {
    it('should call doc(id).delete() when deleting a task', async () => {
      const collectionInstance = (db.collection as jest.Mock).mock.results[0].value;

      const deleteMock = jest.fn().mockResolvedValue(undefined);
      (collectionInstance.doc as jest.Mock).mockReturnValue({
        delete: deleteMock,
      });

      await repository.delete('task-id-abc');

      expect(collectionInstance.doc).toHaveBeenCalledWith('task-id-abc');
      expect(deleteMock).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * Tests for update method
   */
  describe('update', () => {
    it('should call update on the correct doc', async () => {
      const collectionInstance = (db.collection as jest.Mock).mock.results[0].value;

      const task = new Task({
        title: 'Old Task',
        userEmail: 'test@example.com',
        description: 'Old description',
        completed: false,
      });

      const updateMock = jest.fn();
      (collectionInstance.doc as jest.Mock).mockReturnValue({
        update: updateMock,
      });

      await repository.update(task);

      expect(updateMock).toHaveBeenCalledTimes(1);
      expect(updateMock).toHaveBeenCalledWith({
        title: task.title,
        description: task.description,
        completed: task.completed,
        completedAt: null,
      });
    });
  });

  /**
   * Tests for findAllByUser method
   */
  describe('findAllByUser', () => {
    it('should return an array of Task objects for a given user', async () => {
      const mockTasksData = [
        { userEmail: 'test@example.com', title: 'Task 1', description: 'Desc 1', completed: false, completedAt: null },
        { userEmail: 'test@example.com', title: 'Task 2', description: 'Desc 2', completed: true, completedAt: new Date() },
      ];

      const getMock = jest.fn().mockResolvedValue({
        empty: false,
        docs: mockTasksData.map(data => ({
          data: () => data,
        })),
      });

      const whereMock = jest.fn(() => ({ orderBy: () => ({ get: getMock }) }));
      (db.collection as jest.Mock).mockReturnValue({ where: whereMock });

      const repository = new TaskFirestoreRepository();

      const tasks = await repository.findAllByUser('test@example.com');

      expect(whereMock).toHaveBeenCalledWith('userEmail', '==', 'test@example.com');
      expect(getMock).toHaveBeenCalled();
      expect(tasks.length).toBe(2);
      expect(tasks[0].title).toBe('Task 1');
      expect(tasks[1].completed).toBe(true);
    });

    it('should return an empty array if the user has no tasks', async () => {
      const getMock = jest.fn().mockResolvedValue({
        empty: true,
        docs: [],
      });

      const whereMock = jest.fn(() => ({ orderBy: () => ({ get: getMock }) }));
      (db.collection as jest.Mock).mockReturnValue({ where: whereMock });

      const repository = new TaskFirestoreRepository();

      const tasks = await repository.findAllByUser('emptyuser@example.com');

      expect(tasks).toEqual([]);
    });
  });
});