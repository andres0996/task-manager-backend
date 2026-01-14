/**
 * DTOs for Auth entity
 */

/**
 * DTO for request Login
 * Required fields: userEmail
 */
export interface LoginUserDTO {
    userEmail: string;
  }
  
/**
 * DTO for Login response
 * Required fields: token
 */
export interface AuthResponseDTO {
  token: string;
}