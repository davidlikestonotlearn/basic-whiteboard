# Basic Whiteboard

A learning project using React and TypeScript, followed by Konva, Express, and PostgreSQL.

## Checkpoint 3: drawing tools

Use Pen, Line, or Arrow to draw. Pick a color and thickness before starting a stroke. Choose Move to drag the blue practice circle. Drawings and the circle position reset when you reload.

## Run locally

Requires Node.js 20.19+ or 22.12+.

1. From the project folder, run `npm --prefix client install`.
2. Run `npm run dev`.
3. Open the local address printed in the terminal.

Run `npm run build` to check TypeScript and produce a production build.

## Read the code in this order

1. `client/index.html`: the page React attaches to.
2. `client/src/main.tsx`: starts React and loads the stylesheet.
3. `client/src/App.tsx`: uses state to switch sidebar content.
4. `client/src/styles.css`: controls layout, spacing, and colors.
5. `client/src/DrawingTab.tsx`: changes the drawing settings stored in App.
6. `client/src/Whiteboard.tsx`: handles pointer events and turns saved points into Konva marks.

## Font

The stylesheet requests Canva Sans. A licensed webfont file has not been supplied, so a sans-serif fallback is used for now.

## Planned checkpoints

- Shape editing and undo/redo/reset
- Express backend
- PostgreSQL board saving
- Persistent image uploads
- Docker Compose
