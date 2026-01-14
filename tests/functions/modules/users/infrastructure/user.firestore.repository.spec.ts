import { UserFirestoreRepository } from '../../../../../functions/src/modules/users/infrastructure/user.firestore.repository';
import { User } from '../../../../../functions/src/modules/users/domain/user.entity';
import { db } from '../../../../../functions/src/config/firebase';

/**
 * Unit tests for UserFirestoreRepository.
 * Ensures correct interaction with Firestore for User entity.
 * 
 */
jest.mock('../../../../src/config/firebase', () => {
  return {
    db: {
      collection: jest.fn(),
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

  /**
   * Tests for `create` method
   */
  describe('create', () => {
    /**
     * Should call Firestore `add` with the correct user data
     */
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

  /**
   * Tests for `findByEmail` method
   */
  describe('findByEmail', () => {
    /**
     * Should call Firestore `where().get()` and return the correct user if found
     */
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

    /**
     * Should return null if no user is found
     */
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