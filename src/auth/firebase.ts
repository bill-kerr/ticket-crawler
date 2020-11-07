import * as admin from 'firebase-admin';
import config from '../config';

export function initFirebase() {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: config.firebaseDatabaseUrl,
  });
  console.log('Firebase initialized.');
}
