import { database } from "../database/connection.js";

export type Upload = {
  id: string;
  name: string;
  mimeType: string;
  width: number;
  height: number;
};

export async function listUploads() {
  const result = await database.query<Upload>(
    'SELECT id, name, mime_type AS "mimeType", width, height FROM uploads ORDER BY created_at DESC, id'
  );
  return result.rows;
}

export async function findUpload(id: string) {
  const result = await database.query<Upload>(
    'SELECT id, name, mime_type AS "mimeType", width, height FROM uploads WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

export async function insertUpload(upload: Upload) {
  await database.query(
    "INSERT INTO uploads (id, name, mime_type, width, height) VALUES ($1, $2, $3, $4, $5)",
    [upload.id, upload.name, upload.mimeType, upload.width, upload.height]
  );
}
