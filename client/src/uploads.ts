export type Upload = {
  id: string;
  name: string;
  mimeType: string;
  width: number;
  height: number;
};

export type PlacedImage = {
  id: string;
  uploadId: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export function imageUrl(uploadId: string) {
  return `/api/uploads/${encodeURIComponent(uploadId)}/file`;
}
