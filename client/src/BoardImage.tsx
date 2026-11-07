import { useEffect, useState } from "react";
import { Image as KonvaImage } from "react-konva/lib/ReactKonvaCore";
import "konva/lib/shapes/Image";
import { imageUrl, type PlacedImage } from "./uploads";

type BoardImageProps = {
  placement: PlacedImage;
  canEdit: boolean;
  selected: boolean;
  onSelect: () => void;
  onMove: (id: string, x: number, y: number) => void;
};

export default function BoardImage({ placement, canEdit, selected, onSelect, onMove }: BoardImageProps) {
  const [bitmap, setBitmap] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const image = new Image();
    image.onload = () => setBitmap(image);
    image.src = imageUrl(placement.uploadId);
    return () => {
      image.onload = null;
    };
  }, [placement.uploadId]);

  if (!bitmap) return null;

  return (
    <KonvaImage
      image={bitmap}
      x={placement.x}
      y={placement.y}
      width={placement.width}
      height={placement.height}
      stroke={selected && canEdit ? "#315b7b" : undefined}
      strokeWidth={2}
      listening={canEdit}
      draggable={canEdit}
      onPointerDown={onSelect}
      onDragStart={onSelect}
      onDragEnd={(event) => onMove(placement.id, event.target.x(), event.target.y())}
    />
  );
}
