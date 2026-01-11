import { UserFirestoreRepository } from '../../../../src/modules/users/infrastructure/user.firestore.repository';
import { User } from '../../../../src/modules/users/domain/user.entity';
import { db } from '../../../../src/config/firebase';

/**
 * Unit tests for UserFirestoreRepository.
 * Ensures correct interaction with Firestore for User entity.
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

describe('UserFirestoreRepository', () => {
  let repository: UserFirestoreRepository;
  let collectionMock: any;

  beforeEach(() => {
    repository = new UserFirestoreRepository();
    collectionMock = (db.collection as jest.Mock)(); // get mocked collection
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call add with correct data when creating a user', async () => {
    const newUser = new User('test@example.com', new Date('2026-01-11T12:00:00Z'));

    await repository.create(newUser);

    // Verify that collection.add() was called once with correct data
    expect(collectionMock.add).toHaveBeenCalledTimes(1);
    expect(collectionMock.add).toHaveBeenCalledWith({
      email: newUser.email,
      createdAt: newUser.createdAt,
    });
  });
});
