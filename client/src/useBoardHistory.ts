import { useCallback, useState } from "react";
import type { Stroke } from "./drawing";
import type { Shape } from "./shapes";

import type { PlacedImage } from "./uploads";

export type Board = {
  strokes: Stroke[];
  shapes: Shape[];
  images: PlacedImage[];
};

type BoardHistory = {
  past: Board[];
  current: Board;
  future: Board[];
};

const emptyBoard: Board = { strokes: [], shapes: [], images: [] };

export default function useBoardHistory() {
  const [history, setHistory] = useState<BoardHistory>({
    past: [],
    current: emptyBoard,
    future: [],
  });

  const restoreBoard = useCallback((savedBoard: Board) => {
    setHistory({ past: [], current: savedBoard, future: [] });
  }, []);

  function editBoard(edit: (board: Board) => Board) {
    setHistory(({ past, current, future }) => {
      const next = edit(current);
      if (next === current) return { past, current, future };

      // A new edit starts a new timeline, so the old redo steps are discarded.
      return { past: [...past, current], current: next, future: [] };
    });
  }

  function undo() {
    setHistory((previous) => {
      const last = previous.past.at(-1);
      if (!last) return previous;

      return {
        past: previous.past.slice(0, -1),
        current: last,
        future: [previous.current, ...previous.future],
      };
    });
  }

  function redo() {
    setHistory((previous) => {
      const [next, ...remaining] = previous.future;
      if (!next) return previous;

      return {
        past: [...previous.past, previous.current],
        current: next,
        future: remaining,
      };
    });
  }

  function reset() {
    editBoard((board) => (board.shapes.length || board.strokes.length || board.images.length ? emptyBoard : board));
  }

  return {
    board: history.current,
    restoreBoard,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    editBoard,
    undo,
    redo,
    reset,
  };
}
