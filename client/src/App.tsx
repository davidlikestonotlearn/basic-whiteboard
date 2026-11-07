import { useState } from "react";
import DrawingTab from "./DrawingTab";
import type { DrawingSettings, Stroke } from "./drawing";
import Whiteboard from "./Whiteboard";
import ShapesTab from "./ShapesTab";
import type { Shape, ShapeKind } from "./shapes";
import useBoardHistory from "./useBoardHistory";

type Tab = "Drawing" | "Shapes" | "Uploads";
const tabs: Tab[] = ["Drawing", "Shapes", "Uploads"];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("Drawing");

  const [drawingSettings, setDrawingSettings] = useState<DrawingSettings>({
    tool: "pen",
    color: "#111111",
    thickness: 4,
  });

  const { board, canUndo, canRedo, editBoard, undo, redo, reset } = useBoardHistory();
  const { shapes, strokes } = board;
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

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
    setSelectedShapeId(shape.id);
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

  function addStroke(stroke: Stroke) {
    editBoard((current) => ({ ...current, strokes: [...current.strokes, stroke] }));
  }

  function deleteSelectedShape() {
    if (!selectedShapeId) return;
    editBoard((current) => ({
      ...current,
      shapes: current.shapes.filter((shape) => shape.id !== selectedShapeId),
    }));
    setSelectedShapeId(null);
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

        <section className="tools" id="tool-panel" role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
          {activeTab === "Drawing" && (
            <DrawingTab settings={drawingSettings} onChange={setDrawingSettings} />
          )}
          {activeTab === "Shapes" && (
            <ShapesTab
              onAdd={addShape}
              onDelete={deleteSelectedShape}
              hasSelection={selectedShapeId !== null}
            />
          )}
          {activeTab === "Uploads" && (
            <>
              <button className="upload-button" disabled>Upload file</button>
              <p className="stage-note">Image uploads will be added in a later step.</p>
            </>
          )}
        </section>

        <div className="board-controls" aria-label="Board controls">
          <button
            disabled={shapes.length === 0 && strokes.length === 0}
            onClick={() => {
              reset();
              setSelectedShapeId(null);
            }}
          >
            Reset
          </button>
          <button
            disabled={!canUndo}
            onClick={() => {
              undo();
              setSelectedShapeId(null);
            }}
          >
            Undo
          </button>
          <button
            disabled={!canRedo}
            onClick={() => {
              redo();
              setSelectedShapeId(null);
            }}
          >
            Redo
          </button>
        </div>
      </aside>
      <Whiteboard
        settings={drawingSettings}
        editingShapes={activeTab === "Shapes" || (activeTab === "Drawing" && drawingSettings.tool === "move")}
        shapes={shapes}
        strokes={strokes}
        onAddStroke={addStroke}
        selectedShapeId={selectedShapeId}
        onSelectShape={setSelectedShapeId}
        onChangeShape={updateShape}
      />
    </main>
  );
}
