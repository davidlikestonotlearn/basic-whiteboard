import { useState } from "react";
import DrawingTab from "./DrawingTab";
import type { DrawingSettings } from "./drawing";
import Whiteboard from "./Whiteboard";
import ShapesTab from "./ShapesTab";
import type { Shape, ShapeKind } from "./shapes";

type Tab = "Drawing" | "Shapes" | "Uploads";
const tabs: Tab[] = ["Drawing", "Shapes", "Uploads"];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("Drawing");

  const [drawingSettings, setDrawingSettings] = useState<DrawingSettings>({
    tool: "pen",
    color: "#111111",
    thickness: 4,
  });

  const [shapes, setShapes] = useState<Shape[]>([]);
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
    setShapes((previous) => [...previous, shape]);
    setSelectedShapeId(shape.id);
  }

  function updateShape(updatedShape: Shape) {
    setShapes((previous) =>
      previous.map((shape) => (shape.id === updatedShape.id ? updatedShape : shape))
    );
  }

  function deleteSelectedShape() {
    setShapes((previous) => previous.filter((shape) => shape.id !== selectedShapeId));
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
          <button disabled>Reset</button>
          <button disabled>Undo</button>
          <button disabled>Redo</button>
        </div>
      </aside>
      <Whiteboard
        settings={drawingSettings}
        editingShapes={activeTab === "Shapes" || (activeTab === "Drawing" && drawingSettings.tool === "move")}
        shapes={shapes}
        selectedShapeId={selectedShapeId}
        onSelectShape={setSelectedShapeId}
        onChangeShape={updateShape}
      />
    </main>
  );
}
