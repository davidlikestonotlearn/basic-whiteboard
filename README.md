# Basic Whiteboard

A learning project using React and TypeScript, followed by Konva, Express, and PostgreSQL.

## Checkpoint 6: Express board API

Use Pen, Line, or Arrow to draw. Pick a color and thickness before starting a stroke. Open Shapes and click an outlined shape to add it. Select or drag a shape on the board, resize it with the corner handles, or use Delete selected shape in the sidebar. The Drawing tab also has a Move tool for selecting and editing shapes. Undo and Redo step through drawing and shape edits. Reset clears the board and can be undone. Save sends a snapshot to Express. Load restores the last saved snapshot and can be undone. Reloading the browser starts with a blank board and fresh history. Click Load to retrieve the snapshot while Express is still running. Restarting Express clears its saved board.

## Run locally

Requires Node.js 20.19+ or 22.12+.

From the project folder, install both sets of dependencies:

```powershell
npm.cmd --prefix client install
npm.cmd --prefix server install
```

Start Express in one terminal with `npm.cmd run dev:server` and Vite in another with `npm.cmd run dev`. Open the local URL printed by Vite. On macOS or Linux, use `npm` in place of `npm.cmd`.

Run `npm.cmd run build` to check TypeScript in both projects and build the frontend.

The frontend uses two endpoints. Vite forwards requests under `/api` to Express at `127.0.0.1:3001`.

| Request | Result |
| --- | --- |
| GET /api/board | Returns the saved board, initially empty |
| PUT /api/board | Replaces the saved board with the supplied shapes and strokes |
## Read the code in this order

1. `client/index.html`: the page React attaches to.
2. `client/src/main.tsx`: starts React and loads the stylesheet.
3. `client/src/App.tsx`: uses state to switch sidebar content.
4. `client/src/styles.css`: controls layout, spacing, and colors.
5. `client/src/DrawingTab.tsx`: changes the drawing settings stored in App.
6. `client/src/Whiteboard.tsx`: handles pointer events and turns saved points into Konva marks.

7. `client/src/useBoardHistory.ts`: keeps the previous, current, and next board states.

8. `client/src/serverRequests/board.ts`: sends the Save and Load requests.
9. `server/src/requests/board.ts`: validates incoming boards and stores the latest one.

## Font

The stylesheet requests Canva Sans. A licensed webfont file has not been supplied, so a sans-serif fallback is used for now.

## Planned checkpoints

- PostgreSQL board saving
- Persistent image uploads
- Docker Compose
