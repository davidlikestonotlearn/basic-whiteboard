import { readFile } from "node:fs/promises";
import { database } from "./connection.js";

try {
  const sql = await readFile(new URL("../../databaseChanges/001_createBoard.sql", import.meta.url), "utf8");
  await database.query(sql);
  console.log("The board table is ready.");
} finally {
  await database.end();
}
