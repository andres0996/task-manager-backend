import admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Initializes Firebase Admin SDK for server-side access to Firestore.
 * Ensures that the app is initialized only once (singleton pattern).
 * Exports the Firestore database instance to be used across repositories.
 */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

/**
 * Firestore database instance to be used throughout the backend.
 * Provides access to collections and documents for CRUD operations.
 */
export const db = admin.firestore();
