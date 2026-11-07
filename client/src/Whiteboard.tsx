import { useEffect, useRef, useState } from "react";
import { Circle, Layer, Stage } from "react-konva/lib/ReactKonvaCore";
// Register only the Konva shape this canvas uses.
import "konva/lib/shapes/Circle";

export default function Whiteboard() {
  const boardRef = useRef<HTMLElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [circle, setCircle] = useState({ x: 100, y: 100 });

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    // Measure the space beside the sidebar so the canvas fits when the window resizes.
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(board);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={boardRef} className="whiteboard" aria-label="Whiteboard">
      <Stage width={size.width} height={size.height}>
        <Layer>
          <Circle
            x={circle.x}
            y={circle.y}
            radius={36}
            fill="#b8ddfa"
            stroke="#315b7b"
            strokeWidth={2}
            draggable
            onDragEnd={(event) => {
              // Konva moves the circle during the drag. React remembers where it landed.
              setCircle({ x: event.target.x(), y: event.target.y() });
            }}
          />
        </Layer>
      </Stage>
    </section>
  );
}
