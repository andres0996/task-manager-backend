/**
 * DTO for request Login
 */
export interface LoginUserDTO {
    userEmail: string;
  }
  
/**
 * DTO for Login response
 */
export interface AuthResponseDTO {
  token: string;
}