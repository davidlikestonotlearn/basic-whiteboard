import { useState } from "react";
import DrawingTab from "./DrawingTab";
import type { DrawingSettings } from "./drawing";
import Whiteboard from "./Whiteboard";

type Tab = "Drawing" | "Shapes" | "Uploads";
const tabs: Tab[] = ["Drawing", "Shapes", "Uploads"];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("Drawing");

  const [drawingSettings, setDrawingSettings] = useState<DrawingSettings>({
    tool: "pen",
    color: "#111111",
    thickness: 4,
  });

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
            <div className="shape-previews" aria-label="Shape previews">
              <div className="rectangle" title="Rectangle" />
              <div className="circle" title="Circle" />
              <div className="triangle" title="Triangle" />
            </div>
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
      <Whiteboard settings={drawingSettings} />
    </main>
  );
}
