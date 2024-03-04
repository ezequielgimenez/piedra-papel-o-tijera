import firebase from "firebase";

import * as dotenv from "dotenv";
dotenv.config();

const app = firebase.initializeApp({
  apiKey: process.env.apiKey,
  authDomain: "prueba-apx.firebaseapp.com",
  databaseURL: process.env.dataBaseURL,
  projectId: "prueba-apx",
});

const rtdb = firebase.database();

export { rtdb };
