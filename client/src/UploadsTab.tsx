import { useEffect, useRef, useState } from "react";
import { listUploads, uploadImage } from "./serverRequests/uploads";
import { imageUrl, type Upload } from "./uploads";

type UploadsTabProps = {
  onAdd: (upload: Upload) => void;
  onDelete: () => void;
  hasSelection: boolean;
};

export default function UploadsTab({ onAdd, onDelete, hasSelection }: UploadsTabProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    listUploads(controller.signal)
      .then(setUploads)
      .catch(() => {
        if (!controller.signal.aborted) setMessage("Could not load past uploads. Reopen this tab to retry.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  async function addFile(files: FileList | null) {
    if (loading || uploading || !files?.length) return;
    if (files.length > 1) {
      setMessage("Upload one image at a time.");
      return;
    }

    setUploading(true);
    setMessage("");
    try {
      const upload = await uploadImage(files[0]);
      setUploads((previous) => [upload, ...previous]);
      setMessage("Image uploaded. Click it below to add it to the board.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not upload the image.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <div
        className="upload-dropzone"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void addFile(event.dataTransfer.files);
        }}
      >
        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          hidden
          onChange={(event) => {
            void addFile(event.currentTarget.files);
            event.currentTarget.value = "";
          }}
        />
        <button
          className="upload-button"
          type="button"
          disabled={loading || uploading}
          onClick={() => fileInput.current?.click()}
        >
          {uploading ? "Uploading..." : "Upload file"}
        </button>
        <p>Or drop an image here</p>
      </div>
      {message && <p className="stage-note" role="status">{message}</p>}
      {uploads.length > 0 && (
        <section aria-label="Past uploads">
          <h2 className="upload-heading">Past uploads</h2>
          <div className="upload-library">
            {uploads.map((upload) => (
              <button
                key={upload.id}
                type="button"
                aria-label={`Add ${upload.name} to board`}
                onClick={() => onAdd(upload)}
              >
                <img src={imageUrl(upload.id)} alt="" loading="lazy" />
                <span>{upload.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}
      {hasSelection && (
        <button className="delete-shape" type="button" onClick={onDelete}>
          Remove selected image
        </button>
      )}
    </>
  );
}
