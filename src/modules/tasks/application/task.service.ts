import { Task } from '../domain/task.entity';
import { ITaskRepository } from '../domain/task.repository.interface';
import { BadRequestError } from '../../../shared/errors/bad-request.error';
import { AppError } from '../../../shared/middlewares/error.middleware';
import { UserService } from '../../users/application/user.service';
import { UserFirestoreRepository } from '../../users/infrastructure/user.firestore.repository';

export class TaskService {
  private readonly userService: UserService;

  constructor(
    private readonly repository: ITaskRepository,
    userService?: UserService
  ) {
    
    this.userService = userService ?? new UserService(new UserFirestoreRepository());
  }

  async createTask(userEmail: string, title: string, description?: string): Promise<Task> {
    if (!userEmail) throw new BadRequestError('User email is required');
    if (!title) throw new BadRequestError('Task title is required');

    // Verify that the user exists
    const user = await this.userService.findUser(userEmail);
    if (!user) throw new AppError('User does not exist', 404);

    const task = new Task({ title, userEmail, description });
    await this.repository.create(task);

    return task;
  }

  async findById(id: string): Promise<Task> {
    const task = await this.repository.findById(id);
  
    if (!task) throw new AppError('Task not found', 404);
  
    return task;
  }

  /**
  * Deletes a task by ID
  * @param id - Task ID
  * @throws BadRequestError if task not found
  */
  async deleteTask(id: string): Promise<void> {
    const task = await this.repository.findById(id);

    if (!task) throw new AppError('Task not found', 404);

    await this.repository.delete(id);
  }
  
}
