import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const config = {
  apiKey: process.env.FIREBASE_CLIENT_API_KEY,
  authDomain: process.env.FIREBASE_CLIENT_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_CLIENT_DATABASE_URL,
  projectId: process.env.FIREBASE_CLIENT_PROJECT_ID,
  storageBucket: process.env.FIREBASE_CLIENT_STORAGE_BUCKET,
};

const app: FirebaseApp = getApps().length === 0 ? initializeApp(config) : getApp();
export default app;
export const googleAuthProvider = new GoogleAuthProvider();
export const firebaseAuth = getAuth(app);
