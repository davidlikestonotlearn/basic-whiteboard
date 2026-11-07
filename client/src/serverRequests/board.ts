import type { Board } from "../useBoardHistory";

export async function saveBoard(board: Board) {
  const response = await fetch("/api/board", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(board),
  });
  if (response.status === 413) throw new Error("This board exceeds the 5 MB save limit.");
  if (!response.ok) throw new Error("Could not save the board. Check that Express is running.");
}

export async function loadBoard(): Promise<Board> {
  const response = await fetch("/api/board");
  if (!response.ok) throw new Error("Could not load the board. Check that Express is running.");
  return response.json();
}
