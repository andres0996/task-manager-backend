import { TaskFirestoreRepository } from '../../../../src/modules/tasks/infrastructure/task.firestore.repository';
import { Task } from '../../../../src/modules/tasks/domain/task.entity';
import { db } from '../../../../src/config/firebase';

/**
 * Unit tests for TaskFirestoreRepository.
 * Ensures correct interaction with Firestore for Task entity.
 */
jest.mock('../../../../src/config/firebase', () => {
  const addMock = jest.fn();
  const getMock = jest.fn();
  const docMock = jest.fn(() => ({ get: getMock }));

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

  // Group tests for create
  describe('create', () => {
    it('should call add with correct data when creating a task', async () => {
      const repository = new TaskFirestoreRepository();
    
      const task = new Task({
        title: 'My Task',
        userEmail: 'test@example.com',
        description: 'Test description'
      });
    
      await repository.create(task);
    
      // Obtenemos la instancia de la colección mockeada
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
  })

  // Group tests for find
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
  })

});