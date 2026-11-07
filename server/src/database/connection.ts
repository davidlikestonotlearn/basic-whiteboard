import "dotenv/config";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Set DATABASE_URL in server/.env before starting the server.");
}

export const database = new Pool({ connectionString, connectionTimeoutMillis: 5000 });

database.on("error", (error) => {
  console.error("PostgreSQL connection error:", error.message);
});
