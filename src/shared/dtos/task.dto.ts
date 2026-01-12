/**
 * DTOs for Task entity
 */

/**
 * DTO for create task
 * Required fields: userEmail, title
 * Optional fields: description
 */
export interface CreateTaskDTO {
  userEmail: string;
  title: string;
  description?: string;
}
  
/**
 * DTO for update task
 * All fields are optionals
 * completed: if true set completedAt else set null
 */
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
}
  
/**
 * DTO for response
 * Includes all fields
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
  