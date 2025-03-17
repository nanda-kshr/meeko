// src/lib/firebase.ts
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Check if already initialized
if (getApps().length === 0) {
  try {
    console.log("Attempting to initialize Firebase Admin SDK");
    const serviceAccountRaw = process.env.NEXT_PRIVATE_FIREBASE_SERVICE_ACCOUNT;

    if (!serviceAccountRaw) {
      throw new Error("NEXT_PRIVATE_FIREBASE_SERVICE_ACCOUNT environment variable is not set");
    }

    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountRaw);
      console.log("Service Account parsed successfully");
    } catch (parseError) {
      throw new Error(`Failed to parse service account JSON: ${parseError.message}`);
    }

    initializeApp({
      credential: cert(serviceAccount)
    });
    
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    throw error; // Fail fast to prevent uninitialized exports
  }
} else {
  console.log("Firebase Admin already initialized, skipping");
}

// Export Firebase Admin services
export const adminDb = getFirestore();
export const adminAuth = getAuth();