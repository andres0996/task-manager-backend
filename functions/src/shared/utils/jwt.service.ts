/**
 * JWT utility functions for the backend.
 *
 * Provides helper functions to generate and verify JSON Web Tokens (JWT)
 * for authentication purposes. Tokens include the user's email and expire
 * in 1 hour by default.
 */
import jwt from "jsonwebtoken";

/**
 * Generate a JSON Web Token (JWT) using the user's email.
 *
 * @param userEmail - The email of the user to include in the token
 * @return A signed JWT string that expires in 1 hour
 */
export const generateToken = (userEmail: string): string => {
  const payload = {email: userEmail};
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
  return token;
};

/**
 * Verify a JSON Web Token (JWT) and return the decoded payload.
 *
 * @param token - The JWT string to verify
 * @return The decoded token payload
 */
export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
