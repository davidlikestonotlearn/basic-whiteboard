# Basic Whiteboard

A learning project using React and TypeScript, followed by Konva, Express, and PostgreSQL.

## Checkpoint 2: Konva canvas

Drag the blue circle on the whiteboard to try Konva. Its position is kept in React state and resets when you reload. The sidebar has three working tabs, with drawing tools, uploads, and board controls coming in later checkpoints.

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
5. `client/src/Whiteboard.tsx`: the Konva Stage is the canvas area, the Layer holds the Circle, and onDragEnd saves its x and y coordinates in React state.

## Font

The stylesheet requests Canva Sans. A licensed webfont file has not been supplied, so a sans-serif fallback is used for now.

## Planned checkpoints

- Pen, colors, thickness, lines, and arrows
- Shape editing and undo/redo/reset
- Express backend
- PostgreSQL board saving
- Persistent image uploads
- Docker Compose
