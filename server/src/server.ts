import express, { type ErrorRequestHandler } from "express";
import boardRequests from "./requests/board.js";

const app = express();
const host = "127.0.0.1";
const port = 3001;

app.use(express.json({ limit: "5mb" }));
app.use("/api/board", boardRequests);

const handleError: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error.type === "entity.parse.failed") {
    response.status(400).json({ error: "The request must contain valid JSON." });
    return;
  }
  if (error.type === "entity.too.large") {
    response.status(413).json({ error: "This board exceeds the 5 MB save limit." });
    return;
  }

  console.error(error);
  response.status(500).json({ error: "The server could not complete the request." });
};

app.use(handleError);
app.listen(port, host, () => {
  console.log(`Whiteboard API listening on http://${host}:${port}`);
});
