import type { DrawingSettings, DrawingTool } from "./drawing";

const tools: { tool: DrawingTool; label: string }[] = [
  { tool: "pen", label: "Pen" },
  { tool: "line", label: "Line" },
  { tool: "arrow", label: "Arrow" },
  { tool: "move", label: "Move" },
];

type DrawingTabProps = {
  settings: DrawingSettings;
  onChange: (settings: DrawingSettings) => void;
};

export default function DrawingTab({ settings, onChange }: DrawingTabProps) {
  return (
    <>
      <div className="drawing-box">
        <label htmlFor="thickness">Pen thickness: {settings.thickness} px</label>
        <input
          id="thickness"
          type="range"
          min={1}
          max={32}
          value={settings.thickness}
          onChange={(event) => onChange({ ...settings, thickness: event.target.valueAsNumber })}
        />
      </div>
      <label className="color-preview">
        Select color
        <input
          type="color"
          value={settings.color}
          onChange={(event) => onChange({ ...settings, color: event.target.value })}
        />
      </label>
      <div className="drawing-box">
        <span>Drawing tool</span>
        <div className="drawing-tools" role="group" aria-label="Drawing tool">
          {tools.map(({ tool, label }) => (
            <button
              key={tool}
              type="button"
              aria-pressed={settings.tool === tool}
              onClick={() => onChange({ ...settings, tool })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
