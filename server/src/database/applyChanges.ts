import { readFile, readdir } from "node:fs/promises";
import { database } from "./connection.js";

try {
  const changes = new URL("../../databaseChanges/", import.meta.url);
  const files = (await readdir(changes)).filter((file) => file.endsWith(".sql")).sort();
  for (const file of files) {
    const sql = await readFile(new URL(file, changes), "utf8");
    await database.query(sql);
    console.log(`Applied ${file}`);
  }
} finally {
  await database.end();
}
