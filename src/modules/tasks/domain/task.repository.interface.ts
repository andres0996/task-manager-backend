/**
 * Task Repository Interface
 *
 * Defines the contract for any implementation responsible for
 * persisting and retrieving Task entities.
 *
 */

import { Task } from './task.entity';

export interface ITaskRepository {
  /**
   * Create a new task.
   * 
   * @param task - Task entity to create
   * @returns Promise resolving when the task is saved
   */
  create(task: Task): Promise<void>;

  /**
   * Find all tasks for a given user.
   * 
   * @param email - Email of the user to retrieve tasks for
   * @returns Promise resolving to an array of Task entities
   */
  findAllByUser(email: string): Promise<Task[]>;

  /**
   * Find a task by its ID.
   * 
   * @param id - Task ID
   * @returns Promise resolving to the Task entity or null if not found
   */
  findById(id: string): Promise<Task | null>;

  /**
   * Update an existing task.
   * 
   * @param task - Task entity with updated data
   * @returns Promise resolving when the update is completed
   */
  update(task: Task): Promise<Task>;

  /**
   * Delete a task by its ID.
   * 
   * @param id - Task ID
   * @returns Promise resolving when the task is deleted
   */
  delete(id: string): Promise<void>;
}