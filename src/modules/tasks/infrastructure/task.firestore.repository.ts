// src/modules/tasks/infrastructure/task.firestore.repository.ts
import { Task } from '../domain/task.entity';
import { ITaskRepository } from '../domain/task.repository.interface';
import { db } from '../../../config/firebase';

/**
 * Firestore implementation of the Task repository.
 * Handles CRUD operations for the Task entity in Firestore.
 */
export class TaskFirestoreRepository implements ITaskRepository {

  /** Reference to the 'tasks' collection in Firestore */
  private collection = db.collection('tasks');

  /**
   * Retrieves all tasks associated with a specific user.
   * @param email - The email of the user
   * @returns An array of Task objects
   */
  async findAllByUser(email: string): Promise<Task[]> {
    throw new Error('Method not implemented.');
  }

  /**
   * Retrieves a single task by its ID.
   * @param id - The ID of the task
   * @returns A Task object if found, or null
   */
  async findById(id: string): Promise<Task | null> {
    const doc = await this.collection.doc(id).get();
    
    if (!doc.exists) return null;
  
    const data = doc.data();
    
    if (!data) return null
    
    return new Task({
      userEmail: data.userEmail,
      title: data.title,
      description: data.description ?? '',
      completed: data.completed ?? false,
      completedAt: data.completedAt ?? null,
    });
  }

  /**
   * Updates an existing task in the collection.
   * @param task - The Task object with updated fields
   */
  async update(task: Task): Promise<void> {
    throw new Error('Method not implemented.');
  }

  /**
   * Deletes a task from the collection by ID.
   * @param id - The ID of the task to delete
   */
  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  /**
   * Creates a new task in the Firestore collection.
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
