/**
 * Task Controller
 *
 * Handles HTTP requests related to Taks operations.
 * Acts as the interface between incoming HTTP requests and the TaskService.
 *
 */

import {Request, Response} from "express";
import {TaskService} from "../application/task.service";
import {TaskFirestoreRepository} from "../infrastructure/task.firestore.repository";
import {AppError} from "../../../shared/middlewares/error.middleware";
import {CreateTaskDTO, UpdateTaskDTO} from "../../../shared/dtos/task.dto";

export class TaskController {
  private service: TaskService;

  /**
   * Constructs the TaskController.
   * @param service - Optional TaskService instance
   */
  constructor(service?: TaskService) {
    this.service = service ?? new TaskService(new TaskFirestoreRepository());
  }

  /**
   * Handles task creation.
   *
   * @param req - Express request object containing the fields in req.body
   * @param res - Express response object to send the result
   */
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateTaskDTO = req.body || {};

      if (!data.userEmail) throw new AppError("userEmail is required", 400);
      if (!data.title) throw new AppError("title is required", 400);

      const task = await this.service.createTask(data);

      res.status(201).json({
        message: "Task created successfully",
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
      res.status(err.statusCode ?? 500).json({message: err.message ?? "Internal server error"});
    }
  }

  /**
   * Handles task find all by email user.
   *
   * @param req - Express request object containing the email in req.params
   * @param res - Express response object to send the result
   */
  async findAllByUser(req: Request, res: Response): Promise<void> {
    try {
      const userEmail = req.params.userEmail;

      if (!userEmail) throw new AppError("userEmail is required", 400);

      const tasks = await this.service.findAllByUser(userEmail as string);

      res.status(200).json({
        message: "Tasks retrieved successfully",
        data: tasks,
      });
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({message: err.message ?? "Internal server error"});
    }
  }

  /**
   * Handles task find.
   *
   * @param req - Express request object containing the id in req.params
   * @param res - Express response object to send the result
   */
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) throw new AppError("Task ID is required", 400);

      const task = await this.service.findById(id as string);

      res.status(200).json({
        message: "Task retrieved successfully",
        data: task,
      });
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({message: err.message ?? "Internal server error"});
    }
  }

  /**
   * Handles task update.
   *
   * @param req - Express request object containing the fields in req.body and req.params
   * @param res - Express response object to send the result
   */
  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const data: UpdateTaskDTO = req.body || {};

      if (!id) throw new AppError("Task ID is required", 400);

      const updatedTask = await this.service.updateTask(id as string, data);

      res.status(200).json({
        message: "Task updated successfully",
        data: updatedTask,
      });
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({message: err.message ?? "Internal server error"});
    }
  }

  /**
   * Handles task delete.
   *
   * @param req - Express request object containing the id in req.params
   * @param res - Express response object to send the result
   */
  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) throw new AppError("Task ID is required", 400);

      await this.service.deleteTask(id as string);

      res.status(200).json({message: "Task deleted successfully"});
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({message: err.message ?? "Internal server error"});
    }
  }
}
