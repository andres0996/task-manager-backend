import { IUserRepository } from '../domain/user.repository.interface';
import { User } from '../domain/user.entity';
import { db } from '../../../config/firebase';

/**
 * Firestore implementation of IUserRepository.
 * Handles CRUD operations for the User entity in Firestore.
 */
export class UserFirestoreRepository implements IUserRepository {
  // Reference to the 'users' collection in Firestore
  private collection = db.collection('users');

  /**
   * Finds a user by their email.
   * @param email - The email to search for
   * @returns User if found, null otherwise
   */
  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.collection.where('email', '==', email).get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();

    // Firestore timestamps are converted to JS Date
    return new User(data.email, data.createdAt.toDate());
  }

  /**
   * Creates a new user document in Firestore.
   * @param user - The User entity to persist
   */
  async create(user: User): Promise<void> {
    // Firestore generates a unique ID automatically if not provided
    await this.collection.add({
      email: user.email,
      createdAt: user.createdAt,
    });
  }

}
