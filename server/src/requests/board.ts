import { Router } from "express";
import { readBoard, writeBoard } from "../queries/board.js";

const router = Router();
const shapeKinds = ["Rectangle", "Square", "Circle", "Triangle", "Hexagon", "Star"];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isShape(value: unknown) {
  return isObject(value) &&
    typeof value.id === "string" &&
    typeof value.kind === "string" && shapeKinds.includes(value.kind) &&
    isNumber(value.x) && isNumber(value.y) &&
    isNumber(value.scaleX) && value.scaleX > 0 &&
    isNumber(value.scaleY) && value.scaleY > 0;
}

function isStroke(value: unknown) {
  if (!isObject(value) || !Array.isArray(value.points) || !value.points.every(isNumber)) return false;

  const pointCount = value.points.length;
  const validTool = value.tool === "pen"
    ? pointCount >= 2 && pointCount % 2 === 0
    : (value.tool === "line" || value.tool === "arrow") && pointCount === 4;

  return validTool &&
    typeof value.id === "string" &&
    typeof value.color === "string" && /^#[0-9a-f]{6}$/i.test(value.color) &&
    isNumber(value.thickness) && value.thickness >= 1 && value.thickness <= 32;
}

router.get("/", async (_request, response) => {
  response.set("Cache-Control", "no-store").json(await readBoard());
});

router.put("/", async (request, response) => {
  const board: unknown = request.body;
  if (!isObject(board) ||
      !Array.isArray(board.shapes) || !board.shapes.every(isShape) ||
      !Array.isArray(board.strokes) || !board.strokes.every(isStroke)) {
    response.status(400).json({ error: "The board must contain valid shapes and strokes." });
    return;
  }

  await writeBoard({ shapes: board.shapes, strokes: board.strokes });
  response.sendStatus(204);
});

export default router;
