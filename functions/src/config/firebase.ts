import admin from "firebase-admin";

/**
 * Initializes Firebase Admin SDK for Cloud Functions environment.
 * Firebase automatically provides credentials, so no manual config is needed.
 */
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Firestore database instance.
 */
export const db = admin.firestore();
