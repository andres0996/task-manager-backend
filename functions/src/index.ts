import * as functions from "firebase-functions";
import app from "./app";
import * as dotenv from "dotenv";
dotenv.config();

export const api = functions.https.onRequest(app);
