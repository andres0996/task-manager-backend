// src/modules/tasks/presentation/task.controller.ts
import { Request, Response } from 'express';
import { TaskService } from '../application/task.service';
import { TaskFirestoreRepository } from '../infrastructure/task.firestore.repository';
import { AppError } from '../../../shared/middlewares/error.middleware';

/**
 * Controller for Task endpoints.
 * Handles HTTP requests and responses for task operations.
 */
export class TaskController {
  private service: TaskService;

  /**
   * Constructs the TaskController.
   * @param service - Optional TaskService instance (for dependency injection/testing)
   */
  constructor(service?: TaskService) {
    // Use the provided service or fallback to Firestore implementation
    this.service = service ?? new TaskService(new TaskFirestoreRepository());
  }

  /**
   * Handles creating a new task.
   * POST /tasks
   */
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { userEmail, title, description } = req.body || {};

      if (!userEmail) {
        // Validate required fields
        throw new AppError('userEmail is required', 400);
      }

      if (!title) {
        // Validate required fields
        throw new AppError('title is required', 400);
      }

      // Delegate task creation to the service
      const task = await this.service.createTask(userEmail, title, description);

      res.status(201).json({
        message: 'Task created successfully',
        data: {
          id: task.id,
          userEmail: task.userEmail,
          title: task.title,
          description: task.description,
          completed: task.completed,
          createdAt: task.createdAt,
        },
      });
    } catch (err: any) {
      if (err instanceof AppError) {
        // Handle custom AppError
        res.status(err.statusCode).json({ message: err.message });
      } else {
        // Handle unexpected errors
        res.status(500).json({ message: err.message || 'Internal server error' });
      }
    }
  }

  /**
   * Handles get a task.
   * GET /tasks/:id
   */
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
  
      if (!id) throw new AppError('Task ID is required', 400);
  
      const task = await this.service.findById(id);

      res.status(200).json({
        message: 'Task retrieved successfully',
        data: task,
      });
    } catch (err: any) {
      if (err instanceof AppError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message || 'Internal server error' });
      }
    }
  }
}
