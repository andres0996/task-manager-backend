/**
 * Firestore Task Repository
 *
 * Implementation of the ITaskRepository interface using Firestore as the backend.
 * Responsible for CRUD operations on Task entities.
 *
 */

import {Task} from "../domain/task.entity";
import {ITaskRepository} from "../domain/task.repository.interface";
import {db} from "../../../config/firebase";

export class TaskFirestoreRepository implements ITaskRepository {
  private collection = db.collection("tasks");

  /**
   * Retrieves all tasks associated with a specific user.
   *
   * @param email - The email of the user
   * @return An array of Task objects
   */
  async findAllByUser(email: string): Promise<Task[]> {
    const snapshot = await this.collection
      .where("userEmail", "==", email)
      .orderBy("createdAt", "asc")
      .get();

    if (snapshot.empty) return [];

    const tasks: Task[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return new Task({
        userEmail: data.userEmail,
        title: data.title,
        description: data.description ?? "",
        completed: data.completed ?? false,
        completedAt: data.completedAt ?? null,
        id: doc.id
      });
    });

    return tasks;
  }

  /**
   * Retrieves a single task by its ID.
   *
   * @param id - The ID of the task
   * @return A Task object if found, or null
   */
  async findById(id: string): Promise<Task | null> {
    const doc = await this.collection.doc(id).get();

    if (!doc.exists) return null;

    const data = doc.data();

    if (!data) return null;

    return new Task({
      userEmail: data.userEmail,
      title: data.title,
      description: data.description ?? "",
      completed: data.completed ?? false,
      completedAt: data.completedAt ?? null,
      id: id
    });
  }

  /**
   * Updates an existing task in the collection.
   *
   * @param task - The Task object with updated fields
   * @return The updated Task object
   */
  async update(task: Task): Promise<Task> {
    await this.collection.doc(task.id!).update({
      title: task.title,
      description: task.description,
      completed: task.completed,
      completedAt: task.completed ? new Date() : null,
    });

    return task;
  }

  /**
   * Deletes a task from the collection by ID.
   *
   * @param id - The ID of the task to delete
   */
  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  /**
   * Creates a new task in the Firestore collection.
   *
   * @param task - The Task object to be persisted
   */
  async create(task: Task): Promise<void> {
    await this.collection.add({
      userEmail: task.userEmail,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.createdAt,
    });
  }
}
