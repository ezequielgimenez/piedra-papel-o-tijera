import * as admin from "firebase-admin";

import * as dotenv from "dotenv";
dotenv.config();

const keyJson = process.env.GOOGLE_APPLICATION_CREDENTIALS;

admin.initializeApp({
  credential: admin.credential.cert(keyJson as any),
  databaseURL: process.env.dataBaseURL,
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };
