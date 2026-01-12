/**
 * DTOs for User entity
 */

/**
 * DTO for user response
 * Required fields: email, createdAt
 */
export interface UserResponseDTO {
  email: string;
  createdAt: Date;
}