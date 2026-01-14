/**
 * Firestore User Repository
 *
 * Implementation of IUserRepository using Firebase Firestore as the storage backend.
 *
 */

import {IUserRepository} from "../domain/user.repository.interface";
import {User} from "../domain/user.entity";
import {db} from "../../../config/firebase";

export class UserFirestoreRepository implements IUserRepository {
  private collection = db.collection("users");

  /**
   * Finds a user by their email.
   *
   * @param email - The email to search for
   * @return User if found, null otherwise
   */
  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.collection.where("email", "==", email).get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();

    return new User(data.email, data.createdAt.toDate());
  }

  /**
   * Creates a new user document in Firestore.
   *
   * @param user - The User entity to persist
   */
  async create(user: User): Promise<void> {
    await this.collection.add({
      email: user.email,
      createdAt: user.createdAt,
    });
  }
}
