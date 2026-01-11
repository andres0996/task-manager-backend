import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Helper function to fetch environment variables safely.
 * Throws an error if a required variable is missing.
 *
 * @param name - Name of the environment variable
 * @param required - Whether the variable is required (default: true)
 * @returns The value of the environment variable
 */
function getEnv(name: string, required = true): string | undefined {
  const value = process.env[name];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Current application environment.
 * Typical values: 'development', 'test', 'production'.
 */
export const NODE_ENV = getEnv('NODE_ENV');

/**
 * Firebase project ID from Google service account
 */
export const FIREBASE_PROJECT_ID = getEnv('FIREBASE_PROJECT_ID');

/**
 * Firebase client email from service account
 */
export const FIREBASE_CLIENT_EMAIL = getEnv('FIREBASE_CLIENT_EMAIL');

/**
 * Firebase private key from service account
 */
export const FIREBASE_PRIVATE_KEY = getEnv('FIREBASE_PRIVATE_KEY');

/**
 * Port for running the Express server (optional, default: 3000)
 */
export const PORT = getEnv('PORT', false) || '3000';
