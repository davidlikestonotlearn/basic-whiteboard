export type DrawingTool = "pen" | "line" | "arrow" | "move";

export type DrawingSettings = {
  tool: DrawingTool;
  color: string;
  thickness: number;
};

export type Stroke = {
  id: string;
  tool: Exclude<DrawingTool, "move">;
  color: string;
  thickness: number;
  // Konva expects a flat list: [x1, y1, x2, y2, ...].
  points: number[];
};
