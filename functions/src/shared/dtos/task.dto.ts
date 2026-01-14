/**
 * DTOs for Task entity
 */

/**
 * DTO for create task
 * Required fields: userEmail, title
 * Optional fields: description, completedAt
 */
export interface CreateTaskDTO {
  userEmail: string;
  title: string;
  description?: string;
  completedAt?: Date
}
  
/**
 * DTO for update task
 * Optional fields: title, description, completed
 * completed: if true set completedAt else set null
 */
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
  completedAt?: Date;
}
  
/**
 * DTO for response
 * Required fields: userEmail, title, 
 * description, completed, createdAt
 * Optional fields: completedAt
 */
export interface TaskResponseDTO {
  id: string;
  userEmail: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: Date | null;
  createdAt: Date;
}
  