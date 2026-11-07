import { database } from "../database/connection.js";

type BoardContents = { shapes: unknown[]; strokes: unknown[]; images: unknown[] };

export async function readBoard(): Promise<BoardContents> {
  const result = await database.query<{ contents: BoardContents }>(
    "SELECT contents FROM board WHERE id = 1"
  );
  const contents = result.rows[0]?.contents;
  if (!contents) return { shapes: [], strokes: [], images: [] };
  return { ...contents, images: contents.images ?? [] };
}

export async function writeBoard(board: BoardContents) {
  // Insert the first snapshot, then replace that same row on later saves.
  await database.query(
    "INSERT INTO board (id, contents) VALUES (1, $1::jsonb) " +
      "ON CONFLICT (id) DO UPDATE SET contents = EXCLUDED.contents",
    [JSON.stringify(board)]
  );
}
