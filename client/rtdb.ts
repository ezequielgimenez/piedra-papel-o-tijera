import firebase from "firebase";
import "firebase/auth";

import * as dotenv from "dotenv";
dotenv.config();

const app = firebase.initializeApp({
  apiKey: process.env.apiKey,
  authDomain: "prueba-apx.firebaseapp.com",
  databaseURL: process.env.dataBaseURL,
  projectId: "prueba-apx",
});

const rtdb = firebase.database();

firebase
  .auth()
  .signInAnonymously()
  .then(() => {
    console.log("Sesión anónima iniciada");
  })
  .catch((error) => {
    console.error("Error al iniciar sesión anónima", error);
  });

export { rtdb };
