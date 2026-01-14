/**
 * Task Routes
 *
 * Defines the HTTP endpoints for Task-related operations.
 *
 */

import {Router} from "express";
import {TaskController} from "./task.controller";
import {authMiddleware} from "../../../shared/middlewares/auth.middleware";


const router = Router();
const controller = new TaskController();

/**
 * Apply authentication middleware to all Task routes.
 *
 * All requests to /tasks endpoints must include a valid JWT in the Authorization header.
 * This ensures that only authenticated users can create, view, update, or delete tasks.
 */
router.use(authMiddleware);

/**
 * Create a new task
 * POST /tasks
 *
 * Request body:
 * {
 *   "userEmail": "test@example.com",
 *   "title": "My Task",
 *   "description": "Optional description"
 * }
 *
 * Response:
 * 201 Created
 * {
 *   "message": "Task created successfully",
 *   "data": {
 *     "id": "taskId",
 *     "userEmail": "test@example.com",
 *     "title": "My Task",
 *     "description": "Optional description",
 *     "completed": false,
 *     "createdAt": "2026-01-12T12:34:56.789Z"
 *   }
 * }
 */
router.post("/", (req, res) => controller.createTask(req, res));

/**
 * Get a task by ID
 * GET /tasks/:id
 *
 * Response:
 * 200 OK
 * {
 *   "message": "Task retrieved successfully",
 *   "data": {
 *     "id": "taskId",
 *     "userEmail": "test@example.com",
 *     "title": "My Task",
 *     "description": "Optional description",
 *     "completed": false,
 *     "createdAt": "2026-01-12T12:34:56.789Z"
 *   }
 * }
 */
router.get("/:id", (req, res) => controller.findById(req, res));

/**
 * Get all tasks for a specific user
 * GET /tasks/user/:email
 *
 * Response:
 * 200 OK
 * [
 *   {
 *     "id": "taskId1",
 *     "userEmail": "test@example.com",
 *     "title": "Task 1",
 *     "description": "Optional description",
 *     "completed": false,
 *     "createdAt": "2026-01-12T12:34:56.789Z"
 *   },
 *   {
 *     "id": "taskId2",
 *     "userEmail": "test@example.com",
 *     "title": "Task 2",
 *     "description": "Optional description",
 *     "completed": true,
 *     "completedAt": "2026-01-12T13:00:00.000Z",
 *     "createdAt": "2026-01-12T12:50:00.000Z"
 *   }
 * ]
 */
router.get("/user/:userEmail", (req, res) => controller.findAllByUser(req, res));

/**
 * Update a task by ID
 * PUT /tasks/:id
 *
 * Request body:
 * {
 *   "title": "Updated Title",
 *   "description": "Updated description",
 *   "completed": true
 * }
 *
 * Response:
 * 200 OK
 * {
 *   "message": "Task updated successfully",
 *   "data": {
 *     "id": "taskId",
 *     "userEmail": "test@example.com",
 *     "title": "Updated Title",
 *     "description": "Updated description",
 *     "completed": true,
 *     "completedAt": "2026-01-12T13:00:00.000Z",
 *     "createdAt": "2026-01-12T12:34:56.789Z"
 *   }
 * }
 */
router.put("/:id", (req, res) => controller.updateTask(req, res));

/**
 * Delete a task by ID
 * DELETE /tasks/:id
 *
 * Response:
 * 200 OK
 * {
 *   "message": "Task deleted successfully"
 * }
 */
router.delete("/:id", (req, res) => controller.deleteTask(req, res));

export default router;
