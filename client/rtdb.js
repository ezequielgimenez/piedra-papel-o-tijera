"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = void 0;
const firebase_1 = require("firebase");
const dotenv = require("dotenv");
dotenv.config();
const app = firebase_1.default.initializeApp({
    apiKey: process.env.apiKey,
    authDomain: "prueba-apx.firebaseapp.com",
    databaseURL: process.env.dataBaseURL,
    projectId: "prueba-apx",
});
const rtdb = firebase_1.default.database();
exports.rtdb = rtdb;
