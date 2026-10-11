
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { db } from "./schema/db.config.js";
import { mainRouter } from "./src/mainRoutes.js";
import { errorHandler, notFound } from "./src/middleware/error-handler.js";
import { PROFILE_UPLOAD_DIR } from "./src/api/profile/config/profile.upload.config.js";
import { warmQuestionTagEmbeddings } from "./src/api/question/service/question-tagging.service.js";

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://ai-powered-evangadi-forum-roan.vercel.app",
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public profile photos only; private RAG documents remain protected.
app.use("/uploads/profiles", express.static(PROFILE_UPLOAD_DIR));

app.use("/api", mainRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    const connection = await db.getConnection();
    connection.release();
    console.log("Connected to database");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Database connection failed. Server not started:",
      error.message,
    );
    process.exit(1);
  }
}

warmQuestionTagEmbeddings();
startServer();
