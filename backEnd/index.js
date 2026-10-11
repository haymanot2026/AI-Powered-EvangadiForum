
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { db } from "./schema/db.config.js";
import { mainRouter } from "./src/mainRoutes.js";
import { errorHandler, notFound } from "./src/middleware/error-handler.js";

const app = express();

app.use(cors({
  origin: "https://ai-powered-evangadi-forum-roan.vercel.app",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", mainRouter);

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
