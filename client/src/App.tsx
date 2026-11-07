import { useState } from "react";
import DrawingTab from "./DrawingTab";
import type { DrawingSettings, Stroke } from "./drawing";
import Whiteboard from "./Whiteboard";
import ShapesTab from "./ShapesTab";
import type { Shape, ShapeKind } from "./shapes";
import UploadsTab from "./UploadsTab";
import type { PlacedImage, Upload } from "./uploads";
import useBoardHistory from "./useBoardHistory";
import useBoardStorage from "./useBoardStorage";

type Tab = "Drawing" | "Shapes" | "Uploads";
const tabs: Tab[] = ["Drawing", "Shapes", "Uploads"];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("Drawing");

  const [drawingSettings, setDrawingSettings] = useState<DrawingSettings>({
    tool: "pen",
    color: "#111111",
    thickness: 4,
  });

  const { board, canUndo, canRedo, editBoard, undo, redo, reset, restoreBoard } = useBoardHistory();
  const { shapes, strokes, images } = board;
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  const storage = useBoardStorage(board, restoreBoard);
  const { ready, loadError, saving, saveError } = storage;
  function addShape(kind: ShapeKind) {
    const offset = (shapes.length % 5) * 12;
    const shape: Shape = {
      id: crypto.randomUUID(),
      kind,
      x: 12,
      y: 24 + offset,
      scaleX: 0.75,
      scaleY: 0.75,
    };
    editBoard((current) => ({ ...current, shapes: [...current.shapes, shape] }));
    setSelectedObjectId(shape.id);
  }

  function updateShape(updatedShape: Shape) {
    editBoard((current) => {
      const original = current.shapes.find((shape) => shape.id === updatedShape.id);
      if (!original) return current;
      if (
        original.x === updatedShape.x && original.y === updatedShape.y &&
        original.scaleX === updatedShape.scaleX && original.scaleY === updatedShape.scaleY
      ) return current;

      return {
        ...current,
        shapes: current.shapes.map((shape) => (shape.id === updatedShape.id ? updatedShape : shape)),
      };
    });
  }

  function addImage(upload: Upload) {
    const scale = Math.min(1, 180 / Math.max(upload.width, upload.height));
    const image: PlacedImage = {
      id: crypto.randomUUID(),
      uploadId: upload.id,
      x: 16,
      y: 24 + (images.length % 5) * 16,
      width: upload.width * scale,
      height: upload.height * scale,
    };
    editBoard((current) => ({ ...current, images: [...current.images, image] }));
    setSelectedObjectId(image.id);
  }

  function moveImage(id: string, x: number, y: number) {
    editBoard((current) => {
      const original = current.images.find((image) => image.id === id);
      if (!original || (original.x === x && original.y === y)) return current;

      return {
        ...current,
        images: current.images.map((image) => (image.id === id ? { ...image, x, y } : image)),
      };
    });
  }

  function removeSelectedImage() {
    editBoard((current) => ({
      ...current,
      images: current.images.filter((image) => image.id !== selectedObjectId),
    }));
    setSelectedObjectId(null);
  }

  function addStroke(stroke: Stroke) {
    editBoard((current) => ({ ...current, strokes: [...current.strokes, stroke] }));
  }

  function deleteSelectedShape() {
    if (!selectedObjectId) return;
    editBoard((current) => ({
      ...current,
      shapes: current.shapes.filter((shape) => shape.id !== selectedObjectId),
    }));
    setSelectedObjectId(null);
  }

  return (
    <main className="app">
      <aside className="sidebar" aria-label="Whiteboard tools">
        <div className="tabs" role="tablist" aria-label="Tool categories">
          {tabs.map((tab) => (
            <button
              key={tab}
              id={`tab-${tab}`}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls="tool-panel"
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <section className="tools" id="tool-panel" inert={!ready} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
          {activeTab === "Drawing" && (
            <DrawingTab settings={drawingSettings} onChange={setDrawingSettings} />
          )}
          {activeTab === "Shapes" && (
            <ShapesTab
              onAdd={addShape}
              onDelete={deleteSelectedShape}
              hasSelection={shapes.some((shape) => shape.id === selectedObjectId)}
            />
          )}
          {activeTab === "Uploads" && (
            <UploadsTab
              onAdd={addImage}
              onDelete={removeSelectedImage}
              hasSelection={images.some((image) => image.id === selectedObjectId)}
            />
          )}
        </section>

        <div className="board-status">
          <p role="status">
            {loadError && "Could not load. Check Express and PostgreSQL."}
            {!ready && !loadError && "Loading board..."}
            {ready && (saveError || (saving ? "Saving..." : "Saved"))}
          </p>
          {loadError && <button onClick={storage.retryLoad}>Retry load</button>}
          {saveError && <button onClick={storage.retrySave}>Retry save</button>}
        </div>
        <div className="board-controls" aria-label="Board controls">
          <button
            disabled={shapes.length === 0 && strokes.length === 0 && images.length === 0}
            onClick={() => {
              reset();
              setSelectedObjectId(null);
            }}
          >
            Reset
          </button>
          <button
            disabled={!canUndo}
            onClick={() => {
              undo();
              setSelectedObjectId(null);
            }}
          >
            Undo
          </button>
          <button
            disabled={!canRedo}
            onClick={() => {
              redo();
              setSelectedObjectId(null);
            }}
          >
            Redo
          </button>
        </div>
      </aside>
      <Whiteboard
        enabled={ready}
        settings={drawingSettings}
        editingObjects={activeTab !== "Drawing" || drawingSettings.tool === "move"}
        shapes={shapes}
        strokes={strokes}
        images={images}
        onMoveImage={moveImage}
        onAddStroke={addStroke}
        selectedObjectId={selectedObjectId}
        onSelectObject={setSelectedObjectId}
        onChangeShape={updateShape}
      />
    </main>
  );
}
