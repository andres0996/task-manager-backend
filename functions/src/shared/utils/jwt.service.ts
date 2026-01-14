/**
 * JWT utility functions for the backend.
 *
 * Provides helper functions to generate and verify JSON Web Tokens (JWT)
 * for authentication purposes. Tokens include the user's email and expire
 * in 1 hour by default.
 */
import jwt from "jsonwebtoken";
import * as functions from "firebase-functions";

/**
 * Generate a JSON Web Token (JWT) using the user's email.
 *
 * @param userEmail - The email of the user to include in the token
 * @return A signed JWT string that expires in 1 hour
 */
export const generateToken = (userEmail: string): string => {
  const payload = {email: userEmail};
  // @ts-ignore
  const JWT_SECRET = functions.config().jwt.secret;
  const token = jwt.sign(payload, JWT_SECRET, {
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
  // @ts-ignore
  const JWT_SECRET = functions.config().jwt.secret;
  return jwt.verify(token, JWT_SECRET);
};
