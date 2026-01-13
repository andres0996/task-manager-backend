/**
 * Application service for Task entity.
 * 
 * This service handles all business logic and use cases related to tasks, 
 * including creation, retrieval, update, deletion, and listing tasks for a user.
 */

import { Task } from '../domain/task.entity';
import { ITaskRepository } from '../domain/task.repository.interface';
import { BadRequestError } from '../../../shared/errors/bad-request.error';
import { AppError } from '../../../shared/middlewares/error.middleware';
import { UserService } from '../../users/application/user.service';
import { UserFirestoreRepository } from '../../users/infrastructure/user.firestore.repository';
import { CreateTaskDTO, UpdateTaskDTO } from '../../../shared/dtos/task.dto';

export class TaskService {
  private readonly userService: UserService;

  /**
   * Constructs the TaskService.
   * @param repository - Implementation of ITaskRepository
   * @param userService - Optional UserService instance (used to validate users)
   */
  constructor(
    private readonly repository: ITaskRepository,
    userService?: UserService
  ) {
    this.userService = userService ?? new UserService(new UserFirestoreRepository());
  }

  /**
   * Creates a new task for a given user.
   *
   * @param userEmail - Email of the user
   * @param title - Title of the task
   * @param description - Optional description of the task
   * @returns The created Task instance
   * @throws BadRequestError if userEmail or title are missing
   * @throws AppError if the user does not exist
   */
  async createTask(data: CreateTaskDTO): Promise<Task> {
    if (!data.userEmail) throw new BadRequestError('User email is required');
    if (!data.title) throw new BadRequestError('Task title is required');

    const user = await this.userService.findUser(data.userEmail);
    if (!user) throw new AppError('User does not exist', 404);

    const task = new Task(data);
    await this.repository.create(task);

    return task;
  }

  /**
   * Finds a task by its ID.
   *
   * @param id - Task ID
   * @returns Task instance
   * @throws AppError if the task does not exist
   */
  async findById(id: string): Promise<Task> {
    const task = await this.repository.findById(id);
    if (!task) throw new AppError('Task not found', 404);
    return task;
  }

  /**
   * Deletes a task by ID.
   *
   * @param id - Task ID
   * @throws AppError if the task does not exist
   */
  async deleteTask(id: string): Promise<void> {
    const task = await this.repository.findById(id);
    if (!task) throw new AppError('Task not found', 404);
    await this.repository.delete(id);
  }

  /**
   * Updates a task by ID.
   *
   * @param id - Task ID
   * @param title - Optional new title
   * @param description - Optional new description
   * @param completed - Optional completion status
   * @returns Updated Task instance
   * @throws AppError if the task does not exist
   */
  async updateTask(
    id: string,
    data: UpdateTaskDTO
  ): Promise<Task> {
    const task = await this.repository.findById(id);
    if (!task) throw new AppError('Task not found', 404);

    if (data.title !== undefined) task.title = data.title;
    if (data.description !== undefined) task.description = data.description;
    if (data.completed !== undefined) {
      task.completed = data.completed;
      task.completedAt = data.completed ? new Date() : null;
    }

    return await this.repository.update(task);
  }

  /**
   * Retrieves all tasks for a specific user.
   *
   * @param userEmail - Email of the user
   * @returns Array of Task instances
   * @throws AppError if user does not exist
   */
  async findAllByUser(userEmail: string): Promise<Task[]> {

    const user = await this.userService.findUser(userEmail);
    if (!user) throw new AppError('User does not exist', 404);

    return await this.repository.findAllByUser(userEmail);
  }
}