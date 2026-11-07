// The sidebar icons and canvas shapes use the same outlines in a 100 by 100 box.
export const shapeOutlines = {
  Rectangle: "M 6 22 H 94 V 78 H 6 Z",
  Square: "M 12 12 H 88 V 88 H 12 Z",
  Circle: "M 50 8 A 42 42 0 1 1 50 92 A 42 42 0 1 1 50 8 Z",
  Triangle: "M 50 10 L 94 88 H 6 Z",
  Hexagon: "M 28 12 H 72 L 94 50 L 72 88 H 28 L 6 50 Z",
  Star: "M 50 6 L 63 36 L 96 39 L 71 60 L 78 93 L 50 76 L 22 93 L 29 60 L 4 39 L 37 36 Z",
};

export type ShapeKind = keyof typeof shapeOutlines;

export type Shape = {
  id: string;
  kind: ShapeKind;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
};
