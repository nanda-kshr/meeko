// lib/firebase.ts
import admin from "firebase-admin";
import { cert } from "firebase-admin/app";

if (!admin.apps.length) {
  try {
    const serviceAccountRaw = process.env.NEXT_PRIVATE_FIREBASE_SERVICE_ACCOUNT;
    
    if (!serviceAccountRaw) {
      throw new Error("Service account key is not defined");
    }
    const serviceAccount = JSON.parse(serviceAccountRaw);

    admin.initializeApp({
      credential: cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
    });
  } catch (error) {
    console.error("Firebase initialization error:", error);
    throw error; // Propagate the error to be caught by the API route
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
export const adminAuth = admin.auth();

export const verifyIdToken = async (token: string) => {
  try {
    return await auth.verifyIdToken(token);
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return null;
  }
};