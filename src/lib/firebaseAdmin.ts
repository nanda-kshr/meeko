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
    throw error; 
  }
}


export const adminAuth = admin.auth();
export const adminDb = admin.firestore();