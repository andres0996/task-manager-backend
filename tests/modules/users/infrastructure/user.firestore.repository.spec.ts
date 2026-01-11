import { UserFirestoreRepository } from '../../../../src/modules/users/infrastructure/user.firestore.repository';
import { User } from '../../../../src/modules/users/domain/user.entity';
import { db } from '../../../../src/config/firebase';

/**
 * Unit tests for UserFirestoreRepository.
 * Ensures correct interaction with Firestore for User entity.
 */
jest.mock('../../../../src/config/firebase', () => {
  return {
    db: {
      collection: jest.fn(), // will be mocked per test
    },
  };
});

describe('UserFirestoreRepository', () => {
  let repository: UserFirestoreRepository;
  let collectionMock: any;
  let addMock: jest.Mock;
  let getMock: jest.Mock;

  beforeEach(() => {
    addMock = jest.fn();
    getMock = jest.fn();

    collectionMock = {
      add: addMock,
      where: jest.fn(() => ({ get: getMock })),
    };

    (db.collection as jest.Mock).mockReturnValue(collectionMock);

    repository = new UserFirestoreRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Group tests for create
  describe('create', () => {
    it('should call add with correct data when creating a user', async () => {
      const newUser = new User('test@example.com', new Date('2026-01-11T12:00:00Z'));

      await repository.create(newUser);

      expect(collectionMock.add).toHaveBeenCalledTimes(1);
      expect(collectionMock.add).toHaveBeenCalledWith({
        email: newUser.email,
        createdAt: newUser.createdAt,
      });
    });
  });

  // Group tests for findByEmail
  describe('findByEmail', () => {
    it('should call collection.where().get() and return the correct user', async () => {
      const email = 'existing@example.com';
      const mockUserData = { email, createdAt: { toDate: () => new Date('2026-01-11T12:00:00Z') } };

      getMock.mockResolvedValue({
        empty: false,
        docs: [{ data: () => mockUserData }],
      });

      const result = await repository.findByEmail(email);

      expect(collectionMock.where).toHaveBeenCalledWith('email', '==', email);
      expect(getMock).toHaveBeenCalled();
      expect(result?.email).toBe(email);
      expect(result?.createdAt).toEqual(mockUserData.createdAt.toDate());
    });

    it('should return null if no user is found', async () => {
      const email = 'notfound@example.com';

      getMock.mockResolvedValue({
        empty: true,
        docs: [],
      });

      const result = await repository.findByEmail(email);

      expect(collectionMock.where).toHaveBeenCalledWith('email', '==', email);
      expect(getMock).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
