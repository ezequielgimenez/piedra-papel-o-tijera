"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = exports.firestore = void 0;
const admin = require("firebase-admin");
const dotenv = require("dotenv");
dotenv.config();
const keyJson = process.env.GOOGLE_APPLICATION_CREDENTIALS;
admin.initializeApp({
    credential: admin.credential.cert(keyJson),
    databaseURL: process.env.dataBaseURL,
});
const firestore = admin.firestore();
exports.firestore = firestore;
const rtdb = admin.database();
exports.rtdb = rtdb;
