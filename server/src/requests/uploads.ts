import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Router } from "express";
import { imageSize } from "image-size";
import multer from "multer";
import { findUpload, insertUpload, listUploads } from "../queries/uploads.js";

const router = Router();
const uploadFolder = process.env.UPLOADS_DIR
  ? resolve(process.env.UPLOADS_DIR)
  : fileURLToPath(new URL("../../uploads/", import.meta.url));
const receiveImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1, fields: 0 },
}).single("image");

const imageTypes = new Map([
  ["png", "image/png"],
  ["jpg", "image/jpeg"],
  ["webp", "image/webp"],
]);
const uuid = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

router.get("/", async (_request, response) => {
  response.set("Cache-Control", "no-store").json(await listUploads());
});

router.post("/", receiveImage, async (request, response) => {
  const file = request.file;
  if (!file) {
    response.status(400).json({ error: "Choose an image to upload." });
    return;
  }

  // Read the image header instead of trusting the extension or browser-provided MIME type.
  const info = readImageInfo(file.buffer);
  const mimeType = info?.type && imageTypes.get(info.type);
  if (!info || !mimeType) {
    response.status(415).json({ error: "Choose a PNG, JPEG, or WebP image." });
    return;
  }
  if (!info.width || !info.height || info.width * info.height > 25_000_000) {
    response.status(400).json({ error: "Choose an image smaller than 25 megapixels." });
    return;
  }

  const upload = {
    id: randomUUID(),
    name: file.originalname,
    mimeType,
    width: info.width,
    height: info.height,
  };
  const path = join(uploadFolder, upload.id);
  await mkdir(uploadFolder, { recursive: true });
  try {
    await writeFile(path, file.buffer, { flag: "wx" });
  } catch (error) {
    // Never delete an existing file if the generated name happens to collide.
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      await unlink(path).catch(() => {});
    }
    throw error;
  }

  try {
    await insertUpload(upload);
  } catch (error) {
    await unlink(path).catch((cleanupError: unknown) => console.error(cleanupError));
    throw error;
  }

  response.status(201).json(upload);
});

function readImageInfo(bytes: Buffer) {
  try {
    return imageSize(bytes);
  } catch {
    return null;
  }
}

router.get("/:id/file", async (request, response) => {
  const upload = uuid.test(request.params.id) ? await findUpload(request.params.id) : undefined;
  if (!upload) {
    response.sendStatus(404);
    return;
  }

  response.set("X-Content-Type-Options", "nosniff");
  response.type(upload.mimeType).sendFile(join(uploadFolder, upload.id));
});

export default router;
