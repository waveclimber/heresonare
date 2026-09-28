import { readFile } from "node:fs/promises";
import { Pool } from "pg";
try {
  process.loadEnvFile(".env.local");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
if (process.env.PLATFORM_STORAGE !== "postgres" || !process.env.DATABASE_URL)
  throw new Error("Configure PostgreSQL before migration.");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  connectionTimeoutMillis: 5000,
});
try {
  await pool.query(await readFile("src/platform/schema.sql", "utf8"));
  console.log("Platform schema v1 ready. Existing data preserved.");
} finally {
  await pool.end();
}
