import { TaskFirestoreRepository } from '../../../../src/modules/tasks/infrastructure/task.firestore.repository';
import { Task } from '../../../../src/modules/tasks/domain/task.entity';
import { db } from '../../../../src/config/firebase';

/**
 * Unit tests for TaskFirestoreRepository.
 * Ensures correct interaction with Firestore for Task entity.
 */
jest.mock('../../../../src/config/firebase', () => {
  const addMock = jest.fn();
  return {
    db: {
      collection: jest.fn(() => ({
        add: addMock,
      })),
    },
  };
});

describe('TaskFirestoreRepository', () => {
  let repository: TaskFirestoreRepository;
  let collectionMock: any;

  beforeEach(() => {
    repository = new TaskFirestoreRepository();
    collectionMock = (db.collection as jest.Mock)();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Group tests for create
  describe('create', () => {
    it('should call add with correct data when creating a task', async () => {

        const task = new Task({
            title: 'My Task', 
            userEmail:'test@example.com',
            description: 'Test description'
        });
    
        await repository.create(task);
    
        expect(collectionMock.add).toHaveBeenCalledTimes(1);
        expect(collectionMock.add).toHaveBeenCalledWith({
          userEmail: task.userEmail,
          title: task.title,
          description: task.description,
          completed: task.completed,
          createdAt: task.createdAt,
        });
      });
  })

});