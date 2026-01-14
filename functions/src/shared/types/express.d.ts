/**
 * Extends the Express Request interface to include custom properties.
 *
 * In this case, `userEmail` is optionally added to the request object
 * after JWT verification or authentication middleware.
 */
import {Request} from "express";

declare global {
  namespace Express {
    interface Request {
      userEmail?: string;
    }
  }
}
