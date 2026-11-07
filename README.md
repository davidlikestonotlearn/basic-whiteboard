# Basic Whiteboard

A local whiteboard built with React, TypeScript, Konva, Express, and PostgreSQL. Docker Compose runs the database.

## Using the whiteboard

Use Pen, Line, or Arrow to draw. Pick a color and thickness before starting a stroke. Open Shapes and click an outlined shape to add it. Select or drag a shape on the board, resize it with the corner handles, or use Delete selected shape in the sidebar. The Drawing tab also has a Move tool for selecting and editing shapes. Undo and Redo step through drawing and shape edits. Reset clears the board and can be undone. The board loads when the app opens and saves automatically after each edit, including Undo, Redo, and Reset. Wait for Saved before closing the tab. PostgreSQL keeps the latest board across restarts. Undo and redo history starts fresh when you reload.

Open Uploads to choose or drop a PNG, JPEG, or WebP image up to 10 MB and 25 megapixels. Click a thumbnail to place a copy on the board. Drag it to move it, or select it and click Remove selected image. Removing a board copy leaves the original available in the library. Back up both PostgreSQL and the server/uploads folder to keep your board and images.

## Run locally

Requires Node.js 20.19+ or 22.12+.

From the project folder, install both sets of dependencies:

```powershell
npm.cmd --prefix client install
npm.cmd --prefix server install
```

### Start PostgreSQL with Docker Compose

Start Docker Desktop, or use a running Docker Engine with the Compose plugin. From the project folder, copy the example settings on a fresh checkout:

```powershell
Copy-Item .env.example .env
Copy-Item server/.env.example server/.env
```

If either `.env` already exists, edit it directly to keep your existing settings. Set `POSTGRES_PASSWORD` in the root `.env` and update `DATABASE_URL` in `server/.env` to use the same password. Use port `5433` for Compose:

```dotenv
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@127.0.0.1:5433/basic_whiteboard
```

Replace `YOUR_PASSWORD` with your password. URL-encode special characters in the password in `DATABASE_URL`. Then run:

```powershell
docker compose up --wait
npm.cmd run db:setup
```

Compose creates the database and waits for PostgreSQL to accept connections. The setup command creates the board and uploads tables and can be rerun safely. Compose exposes PostgreSQL only on localhost and keeps its data in the named `postgres_data` volume. Run `docker compose stop` to stop the database and `docker compose up --wait` to start it again with the same data.

### Use an existing PostgreSQL installation

If you already use a local PostgreSQL database, you can keep using it. Create `basic_whiteboard` if needed, point `server/.env` at that database and port, and run `npm.cmd run db:setup`. The Compose database starts separately. To move existing board and upload records into it, restore a database backup and keep the corresponding files in `server/uploads/`.

### Start the app

Start Express in one terminal with `npm.cmd run dev:server` and Vite in another with `npm.cmd run dev`. Open the local URL printed by Vite. On macOS or Linux, use `npm` in place of `npm.cmd`.

Run `npm.cmd run build` to check TypeScript in both projects and build the frontend.

Vite forwards requests under `/api` to Express at `127.0.0.1:3001`.

| Request | Result |
| --- | --- |
| GET /api/board | Returns the saved board, initially empty |
| PUT /api/board | Replaces the saved board with the supplied shapes, strokes, and image placements |
| GET /api/uploads | Lists past uploads |
| POST /api/uploads | Accepts one multipart image and saves its file and record |
| GET /api/uploads/:id/file | Serves the image by its saved ID |

## Read the code in this order

1. `client/index.html`: the page React attaches to.
2. `client/src/main.tsx`: starts React and loads the stylesheet.
3. `client/src/App.tsx`: uses state to switch sidebar content.
4. `client/src/styles.css`: controls layout, spacing, and colors.
5. `client/src/DrawingTab.tsx`: changes the drawing settings stored in App.
6. `client/src/Whiteboard.tsx`: handles pointer events and turns saved points into Konva marks.

7. `client/src/useBoardHistory.ts`: keeps the previous, current, and next board states.

8. `client/src/serverRequests/board.ts`: sends HTTP requests to load and save the board.
9. `server/src/requests/board.ts`: validates incoming boards and calls the database queries.

10. `client/src/useBoardStorage.ts`: loads the saved board and sends one save at a time.
11. `server/src/queries/board.ts`: reads and writes the single JSONB snapshot.
12. `server/databaseChanges/001_createBoard.sql`: creates the table and restricts it to one row.

13. `client/src/UploadsTab.tsx`: handles file selection, drop, and the image library.
14. `server/src/requests/uploads.ts`: checks image uploads, saves files, and serves saved images.

## Font

The stylesheet requests Canva Sans. A licensed webfont file has not been supplied, so a sans-serif fallback is used for now.
