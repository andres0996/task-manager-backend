/**
 * Authentication middleware for Express.
 *
 * Verifies JWT tokens sent in the Authorization header and
 * attaches the user's email to the request object if valid.
 * Denies access with 401 Unauthorized if the token is missing or invalid.
 */
import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import * as functions from "firebase-functions";

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
    res.status(401).json({message: "Token missing"});
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    // @ts-ignore
    const JWT_SECRET = functions.config().jwt.secret;
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.userEmail = payload.email;
    next();
    return;
  } catch (err) {
    res.status(401).json({message: "Invalid token"});
    return;
  }
};
