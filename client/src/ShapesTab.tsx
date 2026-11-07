import { shapeOutlines, type ShapeKind } from "./shapes";

type ShapesTabProps = {
  onAdd: (kind: ShapeKind) => void;
  onDelete: () => void;
  hasSelection: boolean;
};

export default function ShapesTab({ onAdd, onDelete, hasSelection }: ShapesTabProps) {
  return (
    <>
      <div className="shape-previews" role="group" aria-label="Add a shape">
        {(Object.keys(shapeOutlines) as ShapeKind[]).map((kind) => (
          <button key={kind} type="button" onClick={() => onAdd(kind)}>
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <path d={shapeOutlines[kind]} />
            </svg>
            {kind}
          </button>
        ))}
      </div>
      <button className="delete-shape" type="button" disabled={!hasSelection} onClick={onDelete}>
        Delete selected shape
      </button>
    </>
  );
}
