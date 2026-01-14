/**
 * DTOs for User entity
 */

/**
 * DTO for user response
 * Required fields: email
 * Optional fields: createdAt
 */
export interface UserResponseDTO {
  email: string;
  createdAt?: Date;
}
