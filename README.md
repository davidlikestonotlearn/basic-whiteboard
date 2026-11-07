# Basic Whiteboard

A learning project using React and TypeScript, followed by Konva, Express, and PostgreSQL.

## Checkpoint 1: page layout

This checkpoint creates the sidebar, three working tabs, and an empty whiteboard. Drawing, saving, uploads, and board controls are not implemented yet. Buttons for future features are disabled.

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

The first layout stays in one component so it is easy to trace. We will split out components as functionality grows.

## Font

The stylesheet requests Canva Sans. A licensed webfont file has not been supplied, so a sans-serif fallback is used for now.

## Planned checkpoints

- Konva canvas and a draggable shape
- Pen, colors, thickness, lines, and arrows
- Shape editing and undo/redo/reset
- Express backend
- PostgreSQL board saving
- Persistent image uploads
- Docker Compose
