// Loads .env before anything else.
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { db } from "./schema/db.config.js";
import { mainRouter } from "./src/mainRoutes.js";
import { errorHandler, notFound } from "./src/middleware/error-handler.js";


const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Main api
app.use("/api", mainRouter);

//  your error handler middleware should be after all api calls
app.use(notFound);
app.use(errorHandler);

// connection and server configuration

async function startServer() {
  try {
    const connection = await db.getConnection();
    connection.release();
    console.log("Connected to database");

    const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

  } catch (error) {
    console.log(error);
  }
}

startServer();
