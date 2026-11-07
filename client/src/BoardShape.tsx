import { useEffect, useRef } from "react";
import type { Path as KonvaPath } from "konva/lib/shapes/Path";
import type { Transformer as KonvaTransformer } from "konva/lib/shapes/Transformer";
import { Path, Transformer } from "react-konva/lib/ReactKonvaCore";
import "konva/lib/shapes/Path";
import "konva/lib/shapes/Transformer";
import { shapeOutlines, type Shape } from "./shapes";

type BoardShapeProps = {
  shape: Shape;
  canEdit: boolean;
  selected: boolean;
  onSelect: () => void;
  onChange: (shape: Shape) => void;
};

export default function BoardShape({ shape, canEdit, selected, onSelect, onChange }: BoardShapeProps) {
  const shapeRef = useRef<KonvaPath>(null);
  const transformerRef = useRef<KonvaTransformer>(null);

  useEffect(() => {
    const node = shapeRef.current;
    const transformer = transformerRef.current;
    if (node && transformer) transformer.nodes([node]);
  }, [selected, canEdit]);

  function savePositionAndSize() {
    const node = shapeRef.current;
    if (!node) return;

    // Konva changes the node during a drag or resize. Save those values in React.
    onChange({
      ...shape,
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
    });
  }

  return (
    <>
      <Path
        ref={shapeRef}
        data={shapeOutlines[shape.kind]}
        x={shape.x}
        y={shape.y}
        scaleX={shape.scaleX}
        scaleY={shape.scaleY}
        fill="transparent"
        stroke="#315b7b"
        strokeWidth={2}
        strokeScaleEnabled={false}
        draggable={canEdit}
        listening={canEdit}
        onPointerDown={onSelect}
        onDragStart={onSelect}
        onDragEnd={savePositionAndSize}
        onTransformEnd={savePositionAndSize}
      />
      {selected && canEdit && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={false}
          flipEnabled={false}
          enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 18 || newBox.height < 18) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
}
