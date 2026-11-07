import { useEffect, useState } from "react";
import { loadBoard, saveBoard } from "./serverRequests/board";
import type { Board } from "./useBoardHistory";

export default function useBoardStorage(board: Board, restoreBoard: (board: Board) => void) {
  const [lastSavedBoard, setLastSavedBoard] = useState<Board | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    loadBoard(controller.signal).then((savedBoard) => {
      if (controller.signal.aborted) return;
      // Mark the restored board as saved so loading does not trigger a write.
      restoreBoard(savedBoard);
      setLastSavedBoard(savedBoard);
    }).catch(() => {
      if (!controller.signal.aborted) setLoadError(true);
    });

    return () => controller.abort();
  }, [loadAttempt, restoreBoard]);

  useEffect(() => {
    // Wait for the initial load and send one snapshot at a time.
    if (!lastSavedBoard || board === lastSavedBoard || saving || saveError) return;

    setSaving(true);
    saveBoard(board).then(() => {
      setLastSavedBoard(board);
    }).catch((error: unknown) => {
      setSaveError(error instanceof Error ? error.message : "Could not save the board.");
    }).finally(() => {
      setSaving(false);
    });
  }, [board, lastSavedBoard, saving, saveError]);

  function retryLoad() {
    setLoadError(false);
    setLoadAttempt((attempt) => attempt + 1);
  }

  return {
    ready: lastSavedBoard !== null,
    loadError,
    retryLoad,
    saving: saving || (lastSavedBoard !== null && board !== lastSavedBoard && !saveError),
    saveError,
    retrySave: () => setSaveError(null),
  };
}
