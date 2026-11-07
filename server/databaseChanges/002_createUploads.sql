CREATE TABLE IF NOT EXISTS uploads (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  mime_type text NOT NULL,
  width integer NOT NULL CHECK (width > 0),
  height integer NOT NULL CHECK (height > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
