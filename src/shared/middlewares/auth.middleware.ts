/**
 * Authentication middleware for Express.
 * 
 * Verifies JWT tokens sent in the Authorization header and
 * attaches the user's email to the request object if valid.
 * Denies access with 401 Unauthorized if the token is missing or invalid.
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Payload structure for JWT.
 */
interface JwtPayload {
  email: string;
}

/**
 * Express middleware to authenticate requests using JWT.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next middleware function
 */
export const authMiddleware = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.userEmail = payload.email;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
