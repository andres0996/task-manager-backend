import { UserFirestoreRepository } from '../../../../src/modules/users/infrastructure/user.firestore.repository';
import { User } from '../../../../src/modules/users/domain/user.entity';
import { db } from '../../../../src/config/firebase';

/**
 * Unit tests for UserFirestoreRepository.
 * Ensures correct interaction with Firestore for User entity.
 * Currently tests the `create` method only.
 */
jest.mock('../../../src/config/firebase', () => {
  // Mock of the Firestore collection
  const collectionMock = {
    doc: jest.fn().mockReturnThis(),       // Mock for doc(): returns the same instance for chaining
    set: jest.fn(),                        // Mock for set(): captures the data sent to Firestore
    where: jest.fn().mockReturnThis(),     // Mock for where(): allows query chaining
    get: jest.fn(),                         // Mock for get(): simulates document retrieval
    docs: [],                               // Mock for documents array (empty by default)
    empty: true,                            // Indicates if the collection is empty
  };

  return {
    db: {
      collection: jest.fn(() => collectionMock), // Always returns the mocked collection
    },
  };
});

describe('UserFirestoreRepository', () => {
  let repository: UserFirestoreRepository;
  let collectionMock: any;

  // Initialize the repository instance and the mocked collection before each test
  beforeEach(() => {
    repository = new UserFirestoreRepository();
    collectionMock = (db.collection as jest.Mock)(); // Reference to the mocked collection
  });

  // Clear all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // `create` should call doc() and set() with the correct user data
  it('should call set with correct data when creating a user', async () => {
    const newUser = new User('test@example.com');

    await repository.create(newUser);

    // Verify that a document was created in Firestore
    expect(collectionMock.doc).toHaveBeenCalled();

    // Verify that the user's data was sent correctly to Firestore
    expect(collectionMock.set).toHaveBeenCalledWith({
      email: newUser.email,
      createdAt: newUser.createdAt,
    });
  });
});
