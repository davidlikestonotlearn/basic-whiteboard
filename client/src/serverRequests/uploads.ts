import type { Upload } from "../uploads";

export async function listUploads(signal: AbortSignal): Promise<Upload[]> {
  const response = await fetch("/api/uploads", { signal });
  if (!response.ok) throw new Error("Could not load past uploads.");
  return response.json();
}

export async function uploadImage(file: File): Promise<Upload> {
  const form = new FormData();
  form.append("image", file);
  const response = await fetch("/api/uploads", { method: "POST", body: form });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || "Could not upload the image.");
  }
  return response.json();
}
