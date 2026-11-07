import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Arrow, Circle, Layer, Line, Stage } from "react-konva/lib/ReactKonvaCore";
import "konva/lib/shapes/Arrow";
import "konva/lib/shapes/Circle";
import "konva/lib/shapes/Line";
import type { DrawingSettings, Stroke } from "./drawing";
import BoardImage from "./BoardImage";
import type { PlacedImage } from "./uploads";
import BoardShape from "./BoardShape";
import type { Shape } from "./shapes";

function getBoardPoint(event: PointerEvent<HTMLElement>): [number, number] {
  const board = event.currentTarget.getBoundingClientRect();
  return [event.clientX - board.left, event.clientY - board.top];
}

function extendStroke(stroke: Stroke, point: [number, number]): Stroke {
  if (point[0] === stroke.points.at(-2) && point[1] === stroke.points.at(-1)) return stroke;

  // The pen keeps every point. A line or arrow only needs its start and end.
  const points = stroke.tool === "pen" ? stroke.points : stroke.points.slice(0, 2);
  return { ...stroke, points: [...points, ...point] };
}

function DrawingMark({ stroke }: { stroke: Stroke }) {
  const lineProps = {
    points: stroke.points,
    stroke: stroke.color,
    strokeWidth: stroke.thickness,
    lineCap: "round" as const,
    lineJoin: "round" as const,
  };
  const [startX, startY] = stroke.points;
  if (stroke.points.length === 2) {
    if (stroke.tool !== "pen") return null;
    return <Circle x={startX} y={startY} radius={stroke.thickness / 2} fill={stroke.color} />;
  }

  if (stroke.tool === "arrow") {
    const tipSize = Math.max(10, stroke.thickness * 2);
    return <Arrow {...lineProps} fill={stroke.color} pointerLength={tipSize} pointerWidth={tipSize} />;
  }

  return <Line {...lineProps} />;
}

type WhiteboardProps = {
  enabled: boolean;
  settings: DrawingSettings;
  editingObjects: boolean;
  shapes: Shape[];
  strokes: Stroke[];
  images: PlacedImage[];
  onMoveImage: (id: string, x: number, y: number) => void;
  onAddStroke: (stroke: Stroke) => void;
  selectedObjectId: string | null;
  onSelectObject: (id: string | null) => void;
  onChangeShape: (shape: Shape) => void;
};

export default function Whiteboard({
  enabled,
  settings,
  editingObjects,
  shapes,
  strokes,
  images,
  onMoveImage,
  onAddStroke,
  selectedObjectId,
  onSelectObject,
  onChangeShape,
}: WhiteboardProps) {
  const boardRef = useRef<HTMLElement>(null);
  const activePointer = useRef<number | null>(null);
  const draftRef = useRef<Stroke | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [draft, setDraft] = useState<Stroke | null>(null);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(board);
    return () => observer.disconnect();
  }, []);

  function updateDraft(stroke: Stroke | null) {
    // The ref gives pointer handlers the latest stroke before React renders the preview.
    draftRef.current = stroke;
    setDraft(stroke);
  }

  function startDrawing(event: PointerEvent<HTMLElement>) {
    if (editingObjects || settings.tool === "move" || event.button !== 0 || activePointer.current !== null) return;

    const point = getBoardPoint(event);
    activePointer.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateDraft({
      id: crypto.randomUUID(),
      tool: settings.tool,
      color: settings.color,
      thickness: settings.thickness,
      points: point,
    });
  }

  function continueDrawing(event: PointerEvent<HTMLElement>) {
    if (event.pointerId !== activePointer.current || !draftRef.current) return;
    updateDraft(extendStroke(draftRef.current, getBoardPoint(event)));
  }

  function cancelDrawing(event: PointerEvent<HTMLElement>) {
    if (event.pointerId !== activePointer.current) return;
    activePointer.current = null;
    updateDraft(null);
  }

  function finishDrawing(event: PointerEvent<HTMLElement>) {
    if (event.pointerId !== activePointer.current || !draftRef.current) return;

    const finishedStroke = extendStroke(draftRef.current, getBoardPoint(event));
    const [startX, startY, endX, endY] = finishedStroke.points;
    const hasLength = finishedStroke.points.length > 2 && (startX !== endX || startY !== endY);
    if (finishedStroke.tool === "pen" || hasLength) {
      onAddStroke(finishedStroke);
    }
    cancelDrawing(event);
  }

  return (
    <section
      ref={boardRef}
      className="whiteboard"
      inert={!enabled}
      aria-label="Whiteboard"
      data-tool={editingObjects ? "move" : settings.tool}
      onPointerDown={startDrawing}
      onPointerMove={continueDrawing}
      onPointerUp={finishDrawing}
      onPointerCancel={cancelDrawing}
      onLostPointerCapture={cancelDrawing}
    >
      <Stage
        width={size.width}
        height={size.height}
        onPointerDown={(event) => {
          if (editingObjects && event.target === event.target.getStage()) onSelectObject(null);
        }}
      >
        <Layer listening={editingObjects}>
          {images.map((image) => (
            <BoardImage
              key={image.id}
              placement={image}
              canEdit={editingObjects}
              selected={image.id === selectedObjectId}
              onSelect={() => onSelectObject(image.id)}
              onMove={onMoveImage}
            />
          ))}
        </Layer>
        <Layer listening={false}>
          {strokes.map((stroke) => <DrawingMark key={stroke.id} stroke={stroke} />)}
          {draft && <DrawingMark stroke={draft} />}
        </Layer>
        <Layer>
          {shapes.map((shape) => (
            <BoardShape
              key={shape.id}
              shape={shape}
              canEdit={editingObjects}
              selected={shape.id === selectedObjectId}
              onSelect={() => onSelectObject(shape.id)}
              onChange={onChangeShape}
            />
          ))}
        </Layer>
      </Stage>
    </section>
  );
}
