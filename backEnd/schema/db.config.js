import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

let db;

// 1. Render ላይ ከሆናችሁ ሙሉውን የAiven መገናኛ ሊንክ (DATABASE_URL) ይጠቀማል
if (process.env.DATABASE_URL) {
  db = mysql.createPool({
    uri: process.env.DATABASE_URL,
    charset: "utf8mb4",
    ssl: {
      rejectUnauthorized: false // Aiven የSSL ግንኙነት በግዴታ ስለሚፈልግ ይህ ወሳኝ ነው
    }
  });
} else {
  // 2. በኮምፒውተርዎ ላይ (Local) ሲሰሩ ደግሞ የድሮውን አሰራር ይጠቀማል
  db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    charset: "utf8mb4",
  });
}

const ensureParams = (params) => {
  if (params === undefined || params === null) {
    throw new Error("SQL parameters are required");
  }
  const isArray = Array.isArray(params);
  const isObject = !isArray && typeof params === "object";
  if (!isArray && !isObject) {
    throw new Error("SQL parameters must be an array or object");
  }
};

const safeExecute = async (sql, params) => {
  if (typeof sql !== "string" || sql.trim().length === 0) {
    throw new Error("SQL query must be a non-empty string");
  }
  ensureParams(params);
  const [result] = await db.execute(sql, params);
  return result;
};

export { db, safeExecute };
